<?php

namespace App\Jobs;

use App\Mail\DailyReportMail;
use App\Models\Report;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendDailyReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying.
     */
    public array $backoff = [30, 60, 120];

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 60;

    public function __construct(
        public readonly Report $report
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Eager-load the submitting user and team.
        // We intentionally do NOT eager-load primarySupervisor here — we fetch
        // it fresh from the DB below to guarantee we have correct column values
        // and don't rely on stale serialised relationship data.
        $this->report->loadMissing(['user', 'team']);

        $team = $this->report->team;

        // ── Resolve primary supervisor directly from DB ────────────────────
        // Using User::find() instead of the relationship accessor prevents a
        // subtle bug where a serialised/cached model can have swapped column
        // values (e.g. name stored in the email field due to a bad seeder or
        // migration), which is what causes the RFC 2822 error in the logs.
        $primarySupervisor = $team->primary_supervisor_id
            ? User::find($team->primary_supervisor_id)
            : null;

        if (! $primarySupervisor) {
            Log::warning("Report #{$this->report->id}: team '{$team->name}' (ID {$team->id}) has no primary supervisor assigned. Skipping email.");
            $this->report->markEmailFailed();
            return;
        }

        if (! $this->isValidEmail($primarySupervisor->email)) {
            Log::error("Report #{$this->report->id}: primary supervisor '{$primarySupervisor->name}' (ID {$primarySupervisor->id}) has an invalid or missing email '{$primarySupervisor->email}'. Fix the user record in the database.", [
                'report_id'     => $this->report->id,
                'supervisor_id' => $primarySupervisor->id,
                'email_value'   => $primarySupervisor->email,
            ]);
            $this->report->markEmailFailed();
            return;
        }

        // ── Build CC list via a fresh query ───────────────────────────────
        // Calling ccSupervisors() (method, not property) ensures the
        // WHERE user_id != primary_supervisor_id constraint is applied in SQL,
        // not in PHP on a pre-loaded collection where it would be silently ignored.
        $ccSupervisors = $team->ccSupervisors()->get();

        $filteredCc = $ccSupervisors
            ->filter(fn(User $u) =>
                $u->email !== $primarySupervisor->email
                && $this->isValidEmail($u->email)
            )
            ->map(fn(User $u) => (object) ['email' => $u->email, 'name' => $u->name])
            ->values()
            ->all();

        $skippedCc = $ccSupervisors->count() - count($filteredCc);
        if ($skippedCc > 0) {
            Log::warning("Report #{$this->report->id}: {$skippedCc} CC supervisor(s) skipped — invalid or missing email addresses.");
        }

        // ── Send ──────────────────────────────────────────────────────────
        $mailable = new DailyReportMail($this->report);

        $mailer = Mail::to($primarySupervisor);

        if (! empty($filteredCc)) {
            $mailer->cc($filteredCc);
        }

        $mailer->send($mailable);

        $this->report->markEmailSent();

        Log::info("Daily report #{$this->report->id} emailed successfully.", [
            'report_id' => $this->report->id,
            'user'      => $this->report->user->email,
            'to'        => $primarySupervisor->email,
            'cc_count'  => count($filteredCc),
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        $this->report->markEmailFailed();

        Log::error("Failed to send daily report #{$this->report->id}: {$exception->getMessage()}", [
            'report_id' => $this->report->id,
            'exception' => $exception,
        ]);
    }

    /**
     * Return true only if $value is a non-empty, RFC-compliant email address.
     */
    private function isValidEmail(mixed $value): bool
    {
        return is_string($value)
            && $value !== ''
            && filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
    }
}
