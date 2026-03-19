<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * List all users with their team, roles, and report counts.
     */
    public function index(): Response
    {
        $users = User::with('team:id,name')
            ->withCount('reports')
            ->orderBy('name')
            ->get()
            ->map(fn(User $u) => [
                'id'            => $u->id,
                'name'          => $u->name,
                'email'         => $u->email,
                'role'          => $u->role,
                'is_supervisor' => $u->isSupervisor(),
                'reports_count' => $u->reports_count,
                'team'          => $u->team
                    ? ['id' => $u->team->id, 'name' => $u->team->name]
                    : null,
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'stats' => [
                'total_users'       => User::count(),
                'total_supervisors' => User::supervisors()->count(),
                'total_admins'      => User::where('role', 'admin')->count(),
            ],
        ]);
    }

    /**
     * Show the create user form.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user'  => null,
            'teams' => $this->teamOptions(),
        ]);
    }

    /**
     * Store a new user.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'team_id'  => ['nullable', 'exists:teams,id'],
            'role'     => ['nullable', 'in:general,admin'],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'team_id'  => $data['team_id'] ?: null,
            'role'     => $data['role'] ?? 'general',
        ]);

        return redirect()
            ->route('users.index')
            ->with('success', "User \"{$user->name}\" created.");
    }

    /**
     * Show the edit form for a user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'team_id' => $user->team_id,
                'role'    => $user->role,
            ],
            'teams' => $this->teamOptions(),
        ]);
    }

    /**
     * Update a user. Password is only changed when explicitly provided.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', "unique:users,email,{$user->id}"],
            'password' => ['nullable', Password::defaults()],
            'team_id'  => ['nullable', 'exists:teams,id'],
            'role'     => ['nullable', 'in:general,admin'],
        ]);

        $payload = [
            'name'    => $data['name'],
            'email'   => $data['email'],
            'team_id' => $data['team_id'] ?: null,
            'role'    => $data['role'] ?? 'general',
        ];

        if (! empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
        }

        $user->update($payload);

        return redirect()
            ->route('users.index')
            ->with('success', "User \"{$user->name}\" updated.");
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->id === Auth::id(), 403, 'You cannot delete your own account.');

        $name = $user->name;
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', "User \"{$name}\" deleted.");
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private function teamOptions(): array
    {
        return Team::orderBy('name')
            ->get(['id', 'name'])
            ->toArray();
    }
}
