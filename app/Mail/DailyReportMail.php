<?php

namespace App\Mail;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DailyReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Report $report
    ) {}

    public function envelope(): Envelope
    {
        $date     = $this->report->report_date->format('l, F j, Y');
        $userName = $this->report->user->name;
        $teamName = $this->report->team->name;

        return new Envelope(
            subject: "Daily Report — {$userName} — {$date}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-report',
            with: [
                'report'   => $this->report,
                'user'     => $this->report->user,
                'team'     => $this->report->team,
                'dateLabel' => $this->report->report_date->format('l, F j, Y'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
