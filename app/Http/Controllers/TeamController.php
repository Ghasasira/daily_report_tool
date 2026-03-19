<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Supervisor;
use App\Models\Team;
use App\Models\User;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * List all teams with supervisors, member counts, and summary stats.
     */
    public function index(): Response
    {
        $teams = Team::with(['primarySupervisor', 'supervisors'])
            ->withCount('members')
            ->latest()
            ->get()
            ->map(fn(Team $team) => [
                'id'                 => $team->id,
                'name'               => $team->name,
                'description'        => $team->description,
                'members_count'      => $team->members_count,
                'primary_supervisor' => $team->primarySupervisor
                    ? $this->formatUser($team->primarySupervisor)
                    : null,
                'supervisors'        => $team->supervisors
                    ->map(fn(User $u) => $this->formatUser($u))
                    ->values(),
            ]);

        return Inertia::render('Admin/Teams/Index', [
            'teams' => $teams,
            'stats' => [
                'total_teams'       => Team::count(),
                'total_supervisors' => Supervisor::distinct('user_id')->count('user_id'),
                'unassigned_users'  => User::whereNull('team_id')
                    ->where('role', '!=', 'admin')
                    ->count(),
            ],
        ]);
    }

    /**
     * Show a single team — members, supervisors, and recent report activity.
     */
    public function show(int $teamId): Response
    {
        $team = Team::findOrFail($teamId);
        $team->load([
            'primarySupervisor',
            'ccSupervisors',
            'members',
        ]);

        // Recent reports from all members of this team (last 30 days)
        $recentReports = Report::where('team_id', $team->id)
            ->with('user:id,name,email')
            ->latest('report_date')
            ->limit(20)
            ->get()
            ->map(fn(Report $r) => [
                'id'               => $r->id,
                'report_date'      => $r->report_date->toDateString(),
                'email_status'     => $r->email_status,
                'tasks_handled'    => count($r->tasks_handled ?? []),
                'tasks_completed'  => count($r->tasks_completed ?? []),
                'user'             => [
                    'id'    => $r->user->id,
                    'name'  => $r->user->name,
                    'email' => $r->user->email,
                ],
            ]);

        // Per-member submission counts (total and last 30 days)
        $memberStats = $team->members->map(function (User $member) {
            $total  = $member->reports()->count();
            $recent = $member->reports()
                ->where('report_date', '>=', now()->subDays(30))
                ->count();
            return [
                'id'            => $member->id,
                'name'          => $member->name,
                'email'         => $member->email,
                'total_reports' => $total,
                'recent_reports' => $recent,
                'last_report'   => $member->reports()
                    ->latest('report_date')
                    ->value('report_date'),
            ];
        });

        return Inertia::render('Admin/Teams/Show', [
            'team' => [
                'id'                 => $team->id,
                'name'               => $team->name,
                'description'        => $team->description,
                'primary_supervisor' => $team->primarySupervisor
                    ? $this->formatUser($team->primarySupervisor)
                    : null,
                'cc_supervisors'     => $team->ccSupervisors
                    ->map(fn(User $u) => $this->formatUser($u))
                    ->values(),
            ],
            'memberStats'   => $memberStats->values(),
            'recentReports' => $recentReports,
        ]);
    }


    /**
     * Show create form.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Teams/Form', [
            'team'        => null,
            'supervisors' => $this->supervisorOptions(),
            'members'     => $this->memberOptions(),
        ]);
    }

    /**
     * Store a new team.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateTeam($request);

        $team = Team::create([
            'name'                  => $data['name'],
            'description'           => $data['description'] ?? null,
            'primary_supervisor_id' => $data['primary_supervisor_id'],
        ]);

        $team->syncSupervisors($data['cc_supervisor_ids'] ?? []);
        $this->syncMembers($team, $data['member_ids'] ?? []);

        return redirect()
            ->route('teams.index')
            ->with('success', "Team \"{$team->name}\" created.");
    }

    /**
     * Show edit form.
     */
    public function edit(Team $team): Response
    {
        $team->loadMissing(['supervisors', 'members']);

        return Inertia::render('Admin/Teams/Form', [
            'team' => [
                'id'                    => $team->id,
                'name'                  => $team->name,
                'description'           => $team->description,
                'primary_supervisor_id' => $team->primary_supervisor_id,
                'supervisor_ids'        => $team->supervisors->pluck('id')->values(),
                'member_ids'            => $team->members->pluck('id')->values(),
            ],
            'supervisors' => $this->supervisorOptions(),
            'members'     => $this->memberOptions(),
        ]);
    }

    /**
     * Update an existing team.
     */
    public function update(Request $request, Team $team): RedirectResponse
    {
        $data = $this->validateTeam($request);

        $team->update([
            'name'                  => $data['name'],
            'description'           => $data['description'] ?? null,
            'primary_supervisor_id' => $data['primary_supervisor_id'],
        ]);

        $team->syncSupervisors($data['cc_supervisor_ids'] ?? []);
        $this->syncMembers($team, $data['member_ids'] ?? [], true);

        return redirect()
            ->route('teams.index')
            ->with('success', "Team \"{$team->name}\" updated.");
    }

    /**
     * Delete a team (members get team_id = null via nullOnDelete).
     */
    public function destroy(Team $team): RedirectResponse
    {
        $name = $team->name;
        $team->delete();

        return redirect()
            ->route('teams.index')
            ->with('success', "Team \"{$name}\" deleted.");
    }

    // ── Private helpers ────────────────────────────────────────────────────

    private function validateTeam(Request $request): array
    {
        return $request->validate([
            'name'                  => ['required', 'string', 'max:255'],
            'description'           => ['nullable', 'string', 'max:255'],
            'primary_supervisor_id' => ['required', 'exists:users,id'],
            'cc_supervisor_ids'        => ['nullable', 'array'],
            'cc_supervisor_ids.*'      => ['exists:users,id'],
            'member_ids'            => ['nullable', 'array'],
            'member_ids.*'          => ['exists:users,id'],
        ]);
    }

    /**
     * Assign members to a team. When $removeExisting is true, any user who
     * was previously on this team but is not in the new list gets unassigned.
     * Admins are never assigned to a team as members.
     */
    private function syncMembers(Team $team, array $memberIds, bool $removeExisting = false): void
    {
        if ($removeExisting) {
            User::where('team_id', $team->id)
                ->whereNotIn('id', $memberIds)
                ->update(['team_id' => null]);
        }

        if (! empty($memberIds)) {
            User::whereIn('id', $memberIds)
                ->where('role', '!=', 'admin')
                ->update(['team_id' => $team->id]);
        }
    }

    /**
     * All users who are supervisors on at least one team,
     * plus any user who could be assigned as a new supervisor.
     * The frontend uses this list to populate supervisor dropdowns.
     */
    private function supervisorOptions(): array
    {
        return User::orderBy('name')
            ->get(['id', 'name', 'email'])
            ->toArray();
    }

    private function memberOptions(): array
    {
        return User::nonAdmins()
            ->with('team:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'team_id'])
            ->map(fn(User $u) => [
                'id'        => $u->id,
                'name'      => $u->name,
                'email'     => $u->email,
                'team_name' => $u->team?->name,
            ])
            ->toArray();
    }

    private function formatUser(User $user): array
    {
        return [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ];
    }
}
