<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'team_id',
        'role',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'       => 'datetime',
            'password'                => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // ── Relationships ──────────────────────────────────────────────────────

    /**
     * The team this user belongs to as a member.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Teams where this user is the primary supervisor.
     */
    public function primaryTeams(): HasMany
    {
        return $this->hasMany(Team::class, 'primary_supervisor_id');
    }

    /**
     * All supervisor table entries for this user.
     */
    public function supervisorEntries(): HasMany
    {
        return $this->hasMany(Supervisor::class);
    }

    /**
     * Reports submitted by this user.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    // ── Scopes ─────────────────────────────────────────────────────────────

    /**
     * Users who are a supervisor on at least one team.
     */
    public function scopeSupervisors($query)
    {
        return $query->whereHas('supervisorEntries');
    }

    /**
     * Users who are not admins.
     */
    public function scopeNonAdmins($query)
    {
        return $query->where('role', '!=', 'admin');
    }

    // ── Role helpers ───────────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * True if this user is a supervisor on at least one team.
     */
    public function isSupervisor(): bool
    {
        return $this->supervisorEntries()->exists();
    }

    /**
     * True if this user is the primary supervisor of the given team.
     */
    public function isPrimarySupervisorOf(Team $team): bool
    {
        return $team->primary_supervisor_id === $this->id;
    }

    // ── Report helpers ─────────────────────────────────────────────────────

    /**
     * Check if the user has already submitted a report today.
     */
    public function hasSubmittedReportToday(): bool
    {
        return $this->reports()
            ->whereDate('report_date', today())
            ->exists();
    }

    /**
     * Get today's report, if any.
     */
    public function todaysReport(): ?Report
    {
        return $this->reports()
            ->whereDate('report_date', today())
            ->first();
    }
}
