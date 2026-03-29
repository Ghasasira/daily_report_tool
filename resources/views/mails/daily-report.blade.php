<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Report</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'DM Sans', sans-serif;
            background-color: #edeae4;
            padding: 32px 16px;
            color: #1a1a18;
        }

        .wrapper {
            max-width: 620px;
            margin: 0 auto;
        }

        /* ── Top eyebrow ── */
        .eyebrow {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 4px 14px;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #7a7870;
        }

        /* ── Header card ── */
        .header {
            background: #1a1a18;
            border-radius: 16px 16px 0 0;
            padding: 36px 40px 32px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -60px;
            right: -60px;
            width: 220px;
            height: 220px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212,185,120,0.18) 0%, transparent 70%);
        }

        .header-date {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #b5a97a;
            margin-bottom: 10px;
        }

        .header-name {
            font-family: 'DM Serif Display', serif;
            font-size: 32px;
            font-weight: 400;
            color: #f5f2eb;
            line-height: 1.1;
            margin-bottom: 8px;
        }

        .header-team {
            font-size: 13px;
            color: #7a7870;
            font-weight: 400;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .header-team::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 1px;
            background: #b5a97a;
        }

        /* ── Body ── */
        .body {
            background: #ffffff;
            padding: 0 40px;
        }

        /* ── Section ── */
        .section {
            padding: 28px 0;
            border-bottom: 1px solid #f0ede8;
        }

        .section:last-child {
            border-bottom: none;
        }

        .section-header {
            margin-bottom: 14px;
        }

        .section-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #9c9890;
        }

        /* ── Task list ── */
        .task-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
        }

        .task-list li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 14px;
            line-height: 1.55;
            color: #2c2c2a;
            background: #fafaf8;
            border: 1px solid #f0ede8;
            width: 100%;
        }

        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .dot-default { background: #c8c4bc; }
        .dot-green   { background: #4caf76; }

        /* ── Text block ── */
        .text-block {
            font-size: 14px;
            line-height: 1.7;
            color: #3c3c3a;
            white-space: pre-wrap;
            padding: 12px 14px;
            background: #fafaf8;
            border-radius: 10px;
            border-left: 3px solid #e8e4dc;
        }

        .empty-note {
            font-size: 13px;
            color: #b5b2ab;
            font-style: italic;
            padding: 8px 0;
        }

        /* ── Footer ── */
        .footer {
            background: #1a1a18;
            border-radius: 0 0 16px 16px;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer-left {
            font-size: 12px;
            color: #5a5a58;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .footer-dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #b5a97a;
        }

        .footer-time {
            color: #b5a97a;
            font-weight: 500;
        }

        .badge {
            background: rgba(181,169,122,0.15);
            color: #b5a97a;
            border: 1px solid rgba(181,169,122,0.25);
            border-radius: 6px;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        /* ── Bottom note ── */
        .bottom-note {
            text-align: center;
            padding-top: 16px;
            font-size: 11px;
            color: #a8a49c;
            letter-spacing: 0.04em;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
            body {
                padding: 16px 8px;
            }

            .eyebrow {
                padding: 0 2px 12px;
                font-size: 10px;
            }

            .header {
                padding: 24px 20px 20px;
                border-radius: 12px 12px 0 0;
            }

            .header-name {
                font-size: 24px;
            }

            .header-date {
                font-size: 10px;
            }

            .header-team {
                font-size: 12px;
            }

            .body {
                padding: 0 20px;
            }

            .section {
                padding: 20px 0;
            }

            .task-list li {
                padding: 9px 10px;
                font-size: 13px;
            }

            .text-block {
                font-size: 13px;
                padding: 10px 12px;
            }

            .footer {
                padding: 16px 20px;
                border-radius: 0 0 12px 12px;
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .bottom-note {
                font-size: 10px;
                padding: 12px 4px 0;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">

        <div class="eyebrow">
            <span>Daily Report</span>
            <span>{{ $dateLabel }}</span>
        </div>

        <div class="header">
            <div class="header-date">{{ $dateLabel }}</div>
            <div class="header-name">{{ $user->name }}</div>
            <div class="header-team">{{ $team->name }}</div>
        </div>

        <div class="body">

            {{-- Tasks Handled --}}
            <div class="section">
                <div class="section-header">
                    <div class="section-title">Tasks Handled</div>
                </div>
                @if(!empty($report->tasks_handled))
                    <ul class="task-list">
                        @foreach($report->tasks_handled as $task)
                            <li>
                                <span class="dot dot-default"></span>
                                <span>{{ $task }}</span>
                            </li>
                        @endforeach
                    </ul>
                @else
                    <p class="empty-note">No tasks recorded.</p>
                @endif
            </div>

            {{-- Completed Today --}}
            <div class="section">
                <div class="section-header">
                    <div class="section-title">Completed Today</div>
                </div>
                @if(!empty($report->tasks_completed))
                    <ul class="task-list">
                        @foreach($report->tasks_completed as $task)
                            <li>
                                <span class="dot dot-green"></span>
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
                <div class="section-header">
                    <div class="section-title">Challenges &amp; Blockers</div>
                </div>
                @if($report->challenges)
                    <p class="text-block">{{ $report->challenges }}</p>
                @else
                    <p class="empty-note">No challenges reported.</p>
                @endif
            </div>

            {{-- Plan for Tomorrow --}}
            <div class="section">
                <div class="section-header">
                    <div class="section-title">Plan for Tomorrow</div>
                </div>
                @if($report->next_day_plan)
                    <p class="text-block">{{ $report->next_day_plan }}</p>
                @else
                    <p class="empty-note">No plan provided.</p>
                @endif
            </div>

            {{-- Additional Notes --}}
            @if($report->additional_notes)
            <div class="section">
                <div class="section-header">
                    <div class="section-title">Additional Notes</div>
                </div>
                <p class="text-block">{{ $report->additional_notes }}</p>
            </div>
            @endif

        </div>

        <div class="footer">
            <div class="footer-left">
                <span class="footer-time">{{ $report->created_at->format('H:i') }}</span>
                <div class="footer-dot"></div>
                <span>{{ config('app.name') }}</span>
            </div>
            <span class="badge">{{ $team->name }}</span>
        </div>

        <div class="bottom-note">
            This report was automatically generated and delivered by {{ config('app.name') }}.
        </div>

    </div>
</body>
</html>