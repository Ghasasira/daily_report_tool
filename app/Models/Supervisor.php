<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Supervisor extends Model
{
    protected $table = 'supervisors';

    protected $fillable = [
        'team_id',
        'user_id',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    /**
     * The team this supervisor entry belongs to.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * The user who acts as supervisor for this team.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ─────────────────────────────────────────────────────────────

    /**
     * Supervisors for a specific team.
     */
    public function scopeForTeam($query, int $teamId)
    {
        return $query->where('team_id', $teamId);
    }

    /**
     * All supervisor entries for a specific user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    /**
     * Check whether a given user is already a supervisor for a given team.
     */
    public static function isSupervisorOf(int $userId, int $teamId): bool
    {
        return static::where('user_id', $userId)
            ->where('team_id', $teamId)
            ->exists();
    }

    /**
     * Assign a user as supervisor of a team (no-op if already assigned).
     */
    public static function assign(int $userId, int $teamId): static
    {
        return static::firstOrCreate([
            'user_id' => $userId,
            'team_id' => $teamId,
        ]);
    }

    /**
     * Remove a user from a team's supervisors.
     */
    public static function unassign(int $userId, int $teamId): void
    {
        static::where('user_id', $userId)
            ->where('team_id', $teamId)
            ->delete();
    }
}
