<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the dashboard for authenticated users.
     */
    public function index(): Response
    {
        $user = Auth::user()->load('team');

        // Check if user is admin/supervisor
        $isAdmin = $user->isAdmin();
        $isSupervisor = $user->isSupervisor();

        if ($isAdmin || $isSupervisor) {
            return $this->adminDashboard($user);
        }

        return $this->userDashboard($user);
    }

    /**
     * User dashboard for regular users.
     */
    private function userDashboard(User $user): Response
    {
        $todaysReport = $user->todaysReport();
        $hasSubmittedToday = $user->hasSubmittedReportToday();

        // Recent reports (last 7 days)
        $recentReports = $user->reports()
            ->where('report_date', '>=', now()->subDays(7))
            ->latest('report_date')
            ->get()
            ->map(fn(Report $report) => [
                'id' => $report->id,
                'report_date' => $report->report_date->format('M j, Y'),
                'email_status' => $report->email_status,
                'tasks_completed' => $report->tasks_completed,
            ]);

        // Stats
        $totalReports = $user->reports()->count();
        $thisWeekReports = $user->reports()
            ->whereBetween('report_date', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        return Inertia::render('Dashboard/User', [
            'todaysReport' => $todaysReport,
            'hasSubmittedToday' => $hasSubmittedToday,
            'recentReports' => $recentReports,
            'team' => $user->team ? [
                'id' => $user->team->id,
                'name' => $user->team->name,
                'description' => $user->team->description,
            ] : null,
            'stats' => [
                'total_reports' => $totalReports,
                'this_week_reports' => $thisWeekReports,
            ],
        ]);
    }

    /**
     * Admin/Supervisor dashboard.
     */
    private function adminDashboard(User $user): Response
    {
        // System stats
        $stats = [
            'total_users' => User::count(),
            'total_teams' => Team::count(),
            'total_reports_today' => Report::whereDate('report_date', today())->count(),
            'total_reports_this_week' => Report::whereBetween('report_date', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'pending_reports_today' => Report::whereDate('report_date', today())
                ->where('email_status', 'pending')
                ->count(),
        ];

        // Recent reports (last 5)
        $recentReports = Report::with(['user:id,name,email', 'team:id,name'])
            ->latest('report_date')
            ->take(5)
            ->get()
            ->map(fn(Report $report) => [
                'id' => $report->id,
                'report_date' => $report->report_date->format('M j, Y'),
                'user' => [
                    'name' => $report->user->name,
                    'email' => $report->user->email,
                ],
                'team' => $report->team ? [
                    'name' => $report->team->name,
                ] : null,
                'email_status' => $report->email_status,
                'tasks_completed' => $report->tasks_completed,
            ]);

        // Teams overview
        $teams = Team::with(['primarySupervisor:id,name,email'])
            ->withCount('members')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn(Team $team) => [
                'id' => $team->id,
                'name' => $team->name,
                'members_count' => $team->members_count,
                'primary_supervisor' => $team->primarySupervisor ? [
                    'name' => $team->primarySupervisor->name,
                ] : null,
            ]);

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'teams' => $teams,
            'isAdmin' => $user->isAdmin(),
            'isSupervisor' => $user->isSupervisor(),
        ]);
    }
}