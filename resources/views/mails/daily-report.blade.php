<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f4f4f5;
            margin: 0;
            padding: 24px;
            color: #18181b;
        }
        .container {
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .header {
            background: #18181b;
            color: #ffffff;
            padding: 28px 32px;
        }
        .header-meta {
            font-size: 12px;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 8px;
        }
        .header h1 {
            margin: 0 0 4px;
            font-size: 22px;
            font-weight: 600;
        }
        .header .subtitle {
            font-size: 14px;
            color: #a1a1aa;
        }
        .body {
            padding: 32px;
        }
        .section {
            margin-bottom: 28px;
        }
        .section-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #71717a;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid #f4f4f5;
        }
        .task-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .task-list li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 7px 0;
            font-size: 14px;
            line-height: 1.5;
            border-bottom: 1px solid #f4f4f5;
        }
        .task-list li:last-child {
            border-bottom: none;
        }
        .bullet {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #18181b;
            flex-shrink: 0;
            margin-top: 6px;
        }
        .bullet.green { background: #16a34a; }
        .text-block {
            font-size: 14px;
            line-height: 1.6;
            color: #3f3f46;
            white-space: pre-wrap;
        }
        .empty-note {
            font-size: 13px;
            color: #a1a1aa;
            font-style: italic;
        }
        .footer {
            background: #fafafa;
            border-top: 1px solid #f4f4f5;
            padding: 20px 32px;
            font-size: 12px;
            color: #71717a;
            display: flex;
            justify-content: space-between;
        }
        .badge {
            display: inline-block;
            background: #f4f4f5;
            color: #52525b;
            border-radius: 4px;
            padding: 2px 8px;
            font-size: 12px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-meta">{{ $dateLabel }}</div>
            <h1>{{ $user->name }}</h1>
            <div class="subtitle">{{ $team->name }} &mdash; Daily Report</div>
        </div>

        <div class="body">

            {{-- Tasks Handled --}}
            <div class="section">
                <div class="section-title">Tasks Handled</div>
                @if(!empty($report->tasks_handled))
                    <ul class="task-list">
                        @foreach($report->tasks_handled as $task)
                            <li>
                                <span class="bullet"></span>
                                <span>{{ $task }}</span>
                            </li>
                        @endforeach
                    </ul>
                @else
                    <p class="empty-note">No tasks recorded.</p>
                @endif
            </div>

            {{-- Tasks Completed --}}
            <div class="section">
                <div class="section-title">Completed Today</div>
                @if(!empty($report->tasks_completed))
                    <ul class="task-list">
                        @foreach($report->tasks_completed as $task)
                            <li>
                                <span class="bullet green"></span>
                                <span>{{ $task }}</span>
                            </li>
                        @endforeach
                    </ul>
                @else
                    <p class="empty-note">Nothing marked as completed.</p>
                @endif
            </div>

            {{-- Challenges --}}
            <div class="section">
                <div class="section-title">Challenges &amp; Blockers</div>
                @if($report->challenges)
                    <p class="text-block">{{ $report->challenges }}</p>
                @else
                    <p class="empty-note">No challenges reported.</p>
                @endif
            </div>

            {{-- Next Day Plan --}}
            <div class="section">
                <div class="section-title">Plan for Tomorrow</div>
                @if($report->next_day_plan)
                    <p class="text-block">{{ $report->next_day_plan }}</p>
                @else
                    <p class="empty-note">No plan provided.</p>
                @endif
            </div>

            {{-- Additional Notes --}}
            @if($report->additional_notes)
            <div class="section">
                <div class="section-title">Additional Notes</div>
                <p class="text-block">{{ $report->additional_notes }}</p>
            </div>
            @endif

        </div>

        <div class="footer">
            <span>Submitted at {{ $report->created_at->format('H:i') }} &mdash; {{ config('app.name') }}</span>
            <span class="badge">{{ $team->name }}</span>
        </div>
    </div>
</body>
</html>
