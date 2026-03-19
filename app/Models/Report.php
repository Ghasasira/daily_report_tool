<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'team_id',
        'report_date',
        'tasks_handled',
        'tasks_completed',
        'challenges',
        'next_day_plan',
        'additional_notes',
        'email_sent_at',
        'email_status',
    ];

    protected $casts = [
        'report_date'     => 'date',
        'tasks_handled'   => 'array',
        'tasks_completed' => 'array',
        'email_sent_at'   => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Mark the report email as successfully sent.
     */
    public function markEmailSent(): void
    {
        $this->update([
            'email_sent_at' => now(),
            'email_status'  => 'sent',
        ]);
    }

    /**
     * Mark the report email as failed.
     */
    public function markEmailFailed(): void
    {
        $this->update(['email_status' => 'failed']);
    }
}
