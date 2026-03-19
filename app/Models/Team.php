<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'primary_supervisor_id',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    /**
     * The primary supervisor — receives reports as the main TO recipient.
     */
    public function primarySupervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'primary_supervisor_id');
    }

    /**
     * All supervisors for this team (including primary).
     */
    public function supervisors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'supervisors')
            ->withTimestamps();
    }

    /**
     * All supervisors except the primary — CC'd on every report email.
     */
    public function ccSupervisors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'supervisors')
            ->withTimestamps()
            ->where('user_id', '!=', $this->primary_supervisor_id);
    }

    /**
     * All members who belong to this team.
     */
    public function members(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * All reports submitted by this team's members.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    /**
     * Sync all supervisors for this team. The primary supervisor is always
     * included regardless of whether they appear in $userIds.
     *
     * @param int[] $userIds
     */
    public function syncSupervisors(array $userIds): void
    {
        $allIds = collect($userIds)
            ->push($this->primary_supervisor_id)
            ->filter()
            ->unique()
            ->values()
            ->all();

        $this->supervisors()->sync($allIds);
    }

    /**
     * Collect all CC email addresses for this team.
     *
     * @return array<int, array{email: string, name: string}>
     */
    public function getCcAddresses(): array
    {
        return $this->ccSupervisors
            ->map(fn(User $user) => [
                'email' => $user->email,
                'name'  => $user->name,
            ])
            ->toArray();
    }
}
