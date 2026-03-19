<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Jobs\SendDailyReportJob;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Show the daily report form (or today's submitted report).
     */
    public function create(): Response
    {
        $userId = Auth::user()->id;
        $user = User::findOrFail($userId)->load('team');
        $todaysReport  = $user->todaysReport();

        return Inertia::render('Reports/Create', [
            'todaysReport' => $todaysReport,
            'hasTeam'      => $user->team !== null,
            'teamName'     => $user->team?->name,
        ]);
    }

    /**
     * Store the daily report and dispatch the email job.
     */
    public function store(StoreReportRequest $request): RedirectResponse
    {
        $userId = Auth::user()->id;
        $user = User::findOrFail($userId)
            ->load('team.primarySupervisor');

        // Prevent double submission for the same day
        if ($user->hasSubmittedReportToday()) {
            return back()->withErrors([
                'general' => 'You have already submitted a report for today.',
            ]);
        }

        $report = Report::create([
            'user_id'          => $user->id,
            'team_id'          => $user->team_id,
            'report_date'      => today(),
            'tasks_handled'    => $request->tasks_handled,
            'tasks_completed'  => $request->tasks_completed,
            'challenges'       => $request->challenges,
            'next_day_plan'    => $request->next_day_plan,
            'additional_notes' => $request->additional_notes,
        ]);

        // Dispatch the email to the queue — non-blocking
        SendDailyReportJob::dispatch($report)
            ->onQueue('emails');

        return redirect()
            ->route('reports.create')
            ->with('success', 'Your report has been submitted and is being sent to your supervisor.');
    }

    /**
     * List all reports for the authenticated user.
     */
    public function index(): Response
    {
        $userId = Auth::user()->id;
        $user = User::findOrFail($userId);

        $reports = $user->reports()
            ->latest('report_date')
            ->paginate(15);

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
        ]);
    }

    /**
     * Show a single report.
     */
    public function show(Report $report): Response
    {
        // Users can only view their own reports
        abort_unless($report->user_id === Auth::id(), 403);

        return Inertia::render('Reports/Show', [
            'report' => $report->load('user', 'team'),
        ]);
    }
}
