<?php

namespace App\Jobs;

use App\Mail\DailyReportMail;
use App\Models\Report;
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
        // Eager-load everything the Mailable will need so we avoid N+1 queries
        $this->report->loadMissing([
            'user',
            'team.primarySupervisor',
            'team.ccSupervisors',
        ]);

        $team = $this->report->team;

        if (! $team->primarySupervisor) {
            Log::warning("Report #{$this->report->id}: team has no primary supervisor. Skipping email.");
            return;
        }

        $mailable = new DailyReportMail($this->report);

        // Build the CC list (all CC supervisors except the primary, to avoid duplicates)
        $primaryEmail = $team->primarySupervisor->email;
        $ccAddresses  = $team->getCcAddresses();
        $filteredCc   = array_filter(
            $ccAddresses,
            fn(array $addr) => $addr['email'] !== $primaryEmail
        );

        $mailer = Mail::to([
            'email' => $team->primarySupervisor->email,
            'name'  => $team->primarySupervisor->name,
        ]);

        if (! empty($filteredCc)) {
            $mailer->cc($filteredCc);
        }

        $mailer->send($mailable);

        $this->report->markEmailSent();

        Log::info("Daily report #{$this->report->id} emailed successfully.", [
            'report_id' => $this->report->id,
            'user'      => $this->report->user->email,
            'to'        => $team->primarySupervisor->email,
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
}
