<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin=======================================================
    Route::get('/admin', fn() => redirect()->route('admin.teams.index'))
        ->name('admin.dashboard');

    // ── Teams ──────────────────────────────────────────────────────
    Route::resource('/admin/teams', TeamController::class);
    // ->name(['teams']);   // No dedicated show page — edit covers this

    // ── Users ──────────────────────────────────────────────────────
    Route::resource('/admin/users', UserController::class)
        ->except(['users']);   // No dedicated show page — edit covers this

    // Quick promote / demote — called from the users index table
    Route::patch('/admin/users/{user}/toggle-supervisor', [UserController::class, 'toggleSupervisor'])
        ->name('admin.users.toggle-supervisor');

    // gen user====================================================
    Route::get('/reports/submit', [ReportController::class, 'create'])
        ->name('reports.create');

    // Submit a new report
    Route::post('/reports', [ReportController::class, 'store'])
        ->name('reports.store');

    // List all of the authenticated user's own reports
    Route::get('/reports', [ReportController::class, 'index'])
        ->name('reports.index');

    // View a single report (users can only view their own — enforced in controller)
    Route::get('/reports/{report}', [ReportController::class, 'show'])
        ->name('reports.show');
});

require __DIR__ . '/settings.php';
