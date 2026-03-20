import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Daily Reporting System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=playfair-display:400,500,600,700,900|dm-sans:300,400,500"
                    rel="stylesheet"
                />
                <style>{`
                    :root {
                        --ink: #0f1117;
                        --ink-soft: #3d3f4a;
                        --ink-muted: #7a7d8a;
                        --paper: #f5f3ee;
                        --paper-warm: #ede9e0;
                        --accent: #c8400a;
                        --accent-light: #e8580d;
                        --accent-pale: #fdf0eb;
                        --line: rgba(15,17,23,0.10);
                        --green: #1a6a3a;
                        --green-pale: #edf5f0;
                    }

                    * { box-sizing: border-box; margin: 0; padding: 0; }

                    body {
                        background: var(--paper);
                        font-family: 'DM Sans', sans-serif;
                        color: var(--ink);
                        overflow-x: hidden;
                    }

                    .display { font-family: 'Playfair Display', Georgia, serif; }

                    /* ── NAV ── */
                    .nav {
                        position: fixed;
                        top: 0; left: 0; right: 0;
                        z-index: 50;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 1.25rem 2.5rem;
                        background: rgba(245,243,238,0.85);
                        backdrop-filter: blur(14px);
                        border-bottom: 1px solid var(--line);
                    }

                    .nav-logo {
                        display: flex;
                        align-items: center;
                        gap: 0.6rem;
                        text-decoration: none;
                        color: var(--ink);
                    }

                    .nav-logo-dot {
                        width: 10px; height: 10px;
                        border-radius: 50%;
                        background: var(--accent);
                    }

                    .nav-logo-text {
                        font-family: 'Playfair Display', serif;
                        font-weight: 700;
                        font-size: 1.1rem;
                        letter-spacing: -0.02em;
                    }

                    .nav-actions { display: flex; gap: 0.75rem; align-items: center; }

                    .btn-ghost {
                        text-decoration: none;
                        color: var(--ink-soft);
                        font-size: 0.875rem;
                        font-weight: 500;
                        padding: 0.5rem 1.1rem;
                        border-radius: 4px;
                        transition: color 0.2s;
                    }
                    .btn-ghost:hover { color: var(--ink); }

                    .btn-primary {
                        text-decoration: none;
                        background: var(--accent);
                        color: #fff;
                        font-size: 0.875rem;
                        font-weight: 500;
                        padding: 0.5rem 1.3rem;
                        border-radius: 4px;
                        transition: background 0.2s;
                    }
                    .btn-primary:hover { background: var(--accent-light); }

                    /* ── HERO ── */
                    .hero {
                        min-height: 100vh;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        padding-top: 72px;
                    }

                    .hero-left {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding: 5rem 3.5rem 5rem 5vw;
                        border-right: 1px solid var(--line);
                    }

                    .hero-eyebrow {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.75rem;
                        font-weight: 500;
                        letter-spacing: 0.12em;
                        text-transform: uppercase;
                        color: var(--accent);
                        margin-bottom: 1.5rem;
                    }

                    .hero-eyebrow::before {
                        content: '';
                        display: block;
                        width: 24px; height: 1px;
                        background: var(--accent);
                    }

                    .hero-title {
                        font-size: clamp(2.8rem, 5vw, 4.2rem);
                        font-weight: 900;
                        line-height: 1.05;
                        letter-spacing: -0.03em;
                        color: var(--ink);
                        margin-bottom: 1.75rem;
                    }

                    .hero-title em {
                        font-style: italic;
                        color: var(--accent);
                    }

                    .hero-sub {
                        font-size: 1.05rem;
                        line-height: 1.7;
                        color: var(--ink-soft);
                        max-width: 440px;
                        margin-bottom: 2.5rem;
                        font-weight: 300;
                    }

                    .hero-ctas {
                        display: flex;
                        gap: 1rem;
                        flex-wrap: wrap;
                    }

                    .cta-main {
                        text-decoration: none;
                        background: var(--ink);
                        color: #fff;
                        font-size: 0.9rem;
                        font-weight: 500;
                        padding: 0.85rem 2rem;
                        border-radius: 4px;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: background 0.2s;
                    }
                    .cta-main:hover { background: var(--accent); }

                    .cta-secondary {
                        text-decoration: none;
                        background: transparent;
                        color: var(--ink-soft);
                        font-size: 0.9rem;
                        font-weight: 500;
                        padding: 0.85rem 1.5rem;
                        border: 1px solid var(--line);
                        border-radius: 4px;
                        transition: border-color 0.2s, color 0.2s;
                    }
                    .cta-secondary:hover { border-color: var(--ink-soft); color: var(--ink); }

                    /* hero right – visual panel */
                    .hero-right {
                        background: var(--ink);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 4rem 3rem;
                        position: relative;
                        overflow: hidden;
                    }

                    .hero-right::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(ellipse at 30% 60%, rgba(200,64,10,0.35) 0%, transparent 65%);
                    }

                    .report-card {
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.12);
                        border-radius: 10px;
                        padding: 2rem;
                        width: 100%;
                        max-width: 380px;
                        position: relative;
                        z-index: 1;
                        backdrop-filter: blur(4px);
                    }

                    .report-card-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 1.5rem;
                    }

                    .report-card-title {
                        font-family: 'Playfair Display', serif;
                        font-size: 1rem;
                        font-weight: 600;
                        color: #fff;
                        letter-spacing: -0.01em;
                    }

                    .report-card-date {
                        font-size: 0.7rem;
                        color: rgba(255,255,255,0.4);
                        letter-spacing: 0.05em;
                    }

                    .report-field {
                        margin-bottom: 1.1rem;
                    }

                    .report-field-label {
                        font-size: 0.65rem;
                        letter-spacing: 0.1em;
                        text-transform: uppercase;
                        color: var(--accent-light);
                        margin-bottom: 0.35rem;
                        font-weight: 500;
                    }

                    .report-field-value {
                        font-size: 0.82rem;
                        color: rgba(255,255,255,0.75);
                        line-height: 1.5;
                    }

                    .report-field-bar {
                        height: 4px;
                        background: rgba(255,255,255,0.08);
                        border-radius: 2px;
                        margin-top: 0.5rem;
                        overflow: hidden;
                    }

                    .report-field-bar-fill {
                        height: 100%;
                        background: var(--accent);
                        border-radius: 2px;
                        width: 78%;
                    }

                    .report-divider {
                        height: 1px;
                        background: rgba(255,255,255,0.08);
                        margin: 1.25rem 0;
                    }

                    .report-send-row {
                        display: flex;
                        align-items: center;
                        gap: 0.6rem;
                    }

                    .send-icon {
                        width: 28px; height: 28px;
                        background: var(--accent);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }

                    .send-label {
                        font-size: 0.75rem;
                        color: rgba(255,255,255,0.5);
                    }

                    .send-label strong {
                        color: rgba(255,255,255,0.9);
                        font-weight: 500;
                    }

                    /* floating badge */
                    .hero-badge {
                        position: absolute;
                        bottom: 2.5rem;
                        right: 2.5rem;
                        background: rgba(255,255,255,0.07);
                        border: 1px solid rgba(255,255,255,0.12);
                        border-radius: 8px;
                        padding: 0.75rem 1rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        z-index: 2;
                    }

                    .badge-dot {
                        width: 7px; height: 7px;
                        border-radius: 50%;
                        background: #4ade80;
                        flex-shrink: 0;
                        box-shadow: 0 0 6px #4ade80;
                    }

                    .badge-text {
                        font-size: 0.72rem;
                        color: rgba(255,255,255,0.6);
                    }

                    /* ── STRIP ── */
                    .strip {
                        border-top: 1px solid var(--line);
                        border-bottom: 1px solid var(--line);
                        padding: 1rem 0;
                        overflow: hidden;
                        background: var(--paper-warm);
                    }

                    .strip-inner {
                        display: flex;
                        gap: 4rem;
                        white-space: nowrap;
                        animation: marquee 28s linear infinite;
                    }

                    .strip-item {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.78rem;
                        font-weight: 500;
                        letter-spacing: 0.06em;
                        text-transform: uppercase;
                        color: var(--ink-muted);
                        flex-shrink: 0;
                    }

                    .strip-sep {
                        width: 4px; height: 4px;
                        border-radius: 50%;
                        background: var(--accent);
                    }

                    @keyframes marquee {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }

                    /* ── HOW IT WORKS ── */
                    .section {
                        padding: 7rem 5vw;
                    }

                    .section-eyebrow {
                        font-size: 0.72rem;
                        letter-spacing: 0.12em;
                        text-transform: uppercase;
                        color: var(--accent);
                        font-weight: 500;
                        margin-bottom: 1rem;
                    }

                    .section-title {
                        font-size: clamp(1.8rem, 3vw, 2.8rem);
                        font-weight: 800;
                        letter-spacing: -0.03em;
                        color: var(--ink);
                        line-height: 1.1;
                        max-width: 500px;
                    }

                    .section-subtitle {
                        font-size: 1rem;
                        line-height: 1.7;
                        color: var(--ink-soft);
                        font-weight: 300;
                        max-width: 480px;
                        margin-top: 1rem;
                    }

                    /* steps */
                    .steps-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 0;
                        margin-top: 4rem;
                        border: 1px solid var(--line);
                        border-radius: 10px;
                        overflow: hidden;
                    }

                    .step {
                        padding: 2.5rem 2rem;
                        border-right: 1px solid var(--line);
                        position: relative;
                    }

                    .step:last-child { border-right: none; }

                    .step-num {
                        font-family: 'Playfair Display', serif;
                        font-size: 3.5rem;
                        font-weight: 900;
                        line-height: 1;
                        color: var(--paper-warm);
                        position: absolute;
                        top: 1.5rem; right: 1.5rem;
                    }

                    .step-icon {
                        width: 44px; height: 44px;
                        border-radius: 8px;
                        background: var(--accent-pale);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 1.25rem;
                        color: var(--accent);
                    }

                    .step-title {
                        font-size: 1rem;
                        font-weight: 600;
                        color: var(--ink);
                        margin-bottom: 0.6rem;
                        letter-spacing: -0.01em;
                    }

                    .step-desc {
                        font-size: 0.875rem;
                        line-height: 1.65;
                        color: var(--ink-soft);
                        font-weight: 300;
                    }

                    /* ── WHY IT MATTERS ── */
                    .why-section {
                        background: var(--ink);
                        padding: 7rem 5vw;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 6rem;
                        align-items: center;
                    }

                    .why-left .section-title { color: #fff; }
                    .why-left .section-eyebrow { color: var(--accent-light); }
                    .why-left .section-subtitle { color: rgba(255,255,255,0.5); }

                    .why-right {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1px;
                        background: rgba(255,255,255,0.07);
                        border-radius: 10px;
                        overflow: hidden;
                        border: 1px solid rgba(255,255,255,0.08);
                    }

                    .why-card {
                        background: var(--ink);
                        padding: 1.75rem;
                    }

                    .why-card-icon {
                        font-size: 1.5rem;
                        margin-bottom: 0.75rem;
                    }

                    .why-card-title {
                        font-size: 0.9rem;
                        font-weight: 600;
                        color: #fff;
                        margin-bottom: 0.4rem;
                        letter-spacing: -0.01em;
                    }

                    .why-card-desc {
                        font-size: 0.8rem;
                        line-height: 1.6;
                        color: rgba(255,255,255,0.45);
                        font-weight: 300;
                    }

                    /* ── EMAIL FLOW ── */
                    .email-section {
                        padding: 7rem 5vw;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 6rem;
                        align-items: center;
                    }

                    .email-visual {
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .email-item {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        padding: 1rem 1.25rem;
                        background: #fff;
                        border: 1px solid var(--line);
                        border-radius: 8px;
                        transition: border-color 0.2s, box-shadow 0.2s;
                    }

                    .email-item:hover {
                        border-color: rgba(200,64,10,0.3);
                        box-shadow: 0 4px 16px rgba(200,64,10,0.06);
                    }

                    .email-avatar {
                        width: 38px; height: 38px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.75rem;
                        font-weight: 600;
                        flex-shrink: 0;
                        color: #fff;
                    }

                    .email-meta { flex: 1; min-width: 0; }

                    .email-name {
                        font-size: 0.82rem;
                        font-weight: 600;
                        color: var(--ink);
                        margin-bottom: 0.15rem;
                    }

                    .email-role {
                        font-size: 0.72rem;
                        color: var(--ink-muted);
                    }

                    .email-badge {
                        font-size: 0.65rem;
                        font-weight: 600;
                        letter-spacing: 0.06em;
                        text-transform: uppercase;
                        padding: 0.25rem 0.6rem;
                        border-radius: 3px;
                        flex-shrink: 0;
                    }

                    .badge-to {
                        background: var(--accent-pale);
                        color: var(--accent);
                    }

                    .badge-cc {
                        background: var(--green-pale);
                        color: var(--green);
                    }

                    .email-connector {
                        height: 1.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .connector-line {
                        width: 1px;
                        height: 100%;
                        background: repeating-linear-gradient(
                            to bottom,
                            var(--line) 0px,
                            var(--line) 4px,
                            transparent 4px,
                            transparent 8px
                        );
                    }

                    /* ── FOOTER ── */
                    .footer {
                        border-top: 1px solid var(--line);
                        padding: 2rem 5vw;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        gap: 1rem;
                    }

                    .footer-brand {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-family: 'Playfair Display', serif;
                        font-weight: 700;
                        font-size: 0.95rem;
                        color: var(--ink);
                    }

                    .footer-copy {
                        font-size: 0.78rem;
                        color: var(--ink-muted);
                    }

                    /* ── RESPONSIVE ── */
                    @media (max-width: 900px) {
                        .hero {
                            grid-template-columns: 1fr;
                            min-height: auto;
                        }

                        .hero-left {
                            padding: 3rem 1.5rem;
                            border-right: none;
                            border-bottom: 1px solid var(--line);
                        }

                        .hero-right {
                            min-height: 360px;
                            padding: 2.5rem 1.5rem;
                        }

                        .hero-badge { display: none; }

                        .steps-grid {
                            grid-template-columns: 1fr;
                        }

                        .step {
                            border-right: none;
                            border-bottom: 1px solid var(--line);
                        }

                        .step:last-child { border-bottom: none; }

                        .why-section {
                            grid-template-columns: 1fr;
                            gap: 3rem;
                        }

                        .email-section {
                            grid-template-columns: 1fr;
                            gap: 3rem;
                        }

                        .nav {
                            padding: 1rem 1.5rem;
                        }

                        .section {
                            padding: 4.5rem 1.5rem;
                        }

                        .why-section {
                            padding: 4.5rem 1.5rem;
                        }

                        .email-section {
                            padding: 4.5rem 1.5rem;
                        }

                        .footer {
                            padding: 1.5rem;
                            justify-content: center;
                            text-align: center;
                        }
                    }

                    @media (max-width: 600px) {
                        .why-right {
                            grid-template-columns: 1fr;
                        }

                        .hero-ctas {
                            flex-direction: column;
                        }

                        .cta-main, .cta-secondary {
                            text-align: center;
                            justify-content: center;
                        }
                    }
                `}</style>
            </Head>

            {/* NAV */}
            <nav className="nav">
                <div className="nav-logo">
                    <div className="nav-logo-dot" />
                    <span className="nav-logo-text display">DailyReport</span>
                </div>
                <div className="nav-actions">
                    {auth.user ? (
                        <Link href={dashboard()} className="btn-primary">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={login()} className="btn-ghost">Log in</Link>
                            {canRegister && (
                                <Link href={register()} className="btn-primary">Get Started</Link>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-left">
                    <span className="hero-eyebrow">Daily Reporting System</span>
                    <h1 className="hero-title display">
                        Every task <em>reported.</em><br />
                        Every supervisor<br />informed.
                    </h1>
                    <p className="hero-sub">
                        A structured way for your team to log daily work — what was done,
                        what was completed, and any challenges faced — then automatically
                        delivered to the right people.
                    </p>
                    <div className="hero-ctas">
                        {auth.user ? (
                            <Link href={dashboard()} className="cta-main">
                                Go to Dashboard
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                        ) : (
                            <>
                                {canRegister && (
                                    <Link href={register()} className="cta-main">
                                        Get Started
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Link>
                                )}
                                <Link href={login()} className="cta-secondary">Sign In</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="hero-right">
                    {/* Mock report card */}
                    <div className="report-card">
                        <div className="report-card-header">
                            <span className="report-card-title display">Daily Report</span>
                            <span className="report-card-date">TODAY · 16:45</span>
                        </div>

                        <div className="report-field">
                            <div className="report-field-label">Tasks Handled</div>
                            <div className="report-field-value">Reviewed procurement documents, attended budget meeting, updated inventory tracker.</div>
                        </div>

                        <div className="report-field">
                            <div className="report-field-label">Completed</div>
                            <div className="report-field-value">Budget reconciliation — Q1 figures finalised and signed off.</div>
                            <div className="report-field-bar">
                                <div className="report-field-bar-fill" />
                            </div>
                        </div>

                        <div className="report-field">
                            <div className="report-field-label">Challenges</div>
                            <div className="report-field-value">Delayed supplier response on order #2947. Following up tomorrow.</div>
                        </div>

                        <div className="report-divider" />

                        <div className="report-send-row">
                            <div className="send-icon">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1l11 5.5L1 12V7.5L8 6.5 1 5.5V1z" fill="white"/>
                                </svg>
                            </div>
                            <div className="send-label">
                                Auto-sent to <strong>Supervisor</strong> &amp; CC'd to team leads
                            </div>
                        </div>
                    </div>

                    <div className="hero-badge">
                        <div className="badge-dot" />
                        <span className="badge-text">Email delivered · Just now</span>
                    </div>
                </div>
            </section>

            {/* MARQUEE STRIP */}
            <div className="strip">
                <div className="strip-inner">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} style={{ display: 'flex', gap: '4rem', flexShrink: 0 }}>
                            {['Daily Reports', 'Task Tracking', 'Auto Email Delivery', 'Supervisor Oversight', 'Team Accountability', 'Challenge Logging', 'Progress Monitoring', 'Structured Reporting'].map((item, j) => (
                                <div key={j} className="strip-item">
                                    <span className="strip-sep" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* HOW IT WORKS */}
            <section className="section">
                <div style={{ marginBottom: '0' }}>
                    <p className="section-eyebrow">How It Works</p>
                    <h2 className="section-title display">Three steps to a fully reported day</h2>
                    <p className="section-subtitle">
                        Simple, consistent, and automatic. No chasing for updates — the system handles delivery.
                    </p>
                </div>

                <div className="steps-grid">
                    <div className="step">
                        <span className="step-num display">01</span>
                        <div className="step-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 5h12M4 10h12M4 15h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h3 className="step-title">Fill Your Daily Report</h3>
                        <p className="step-desc">
                            Each team member logs their daily tasks — what they handled, what was completed, any blockers or challenges encountered during the day.
                        </p>
                    </div>

                    <div className="step">
                        <span className="step-num display">02</span>
                        <div className="step-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M10 7v3.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h3 className="step-title">Submit When Ready</h3>
                        <p className="step-desc">
                            Once complete, submit the report for the day. The system timestamps it and queues it for delivery — no manual emailing required.
                        </p>
                    </div>

                    <div className="step">
                        <span className="step-num display">03</span>
                        <div className="step-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                        </div>
                        <h3 className="step-title">Supervisors Are Notified</h3>
                        <p className="step-desc">
                            The main supervisor receives the report directly. All other supervisors are CC'd automatically — keeping everyone in the loop with zero extra effort.
                        </p>
                    </div>
                </div>
            </section>

            {/* WHY IT MATTERS */}
            <section className="why-section">
                <div className="why-left">
                    <p className="section-eyebrow">Why It Matters</p>
                    <h2 className="section-title display">Visibility that keeps teams moving</h2>
                    <p className="section-subtitle">
                        When everyone reports consistently, managers stop guessing and start acting on real information. Problems surface early, progress is visible, and accountability becomes effortless.
                    </p>
                </div>

                <div className="why-right">
                    <div className="why-card">
                        <div className="why-card-icon">📋</div>
                        <h3 className="why-card-title">Consistent Records</h3>
                        <p className="why-card-desc">A daily log of every team member's work, always in one place. No scattered messages or forgotten updates.</p>
                    </div>

                    <div className="why-card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="why-card-icon">⚡</div>
                        <h3 className="why-card-title">Early Problem Spotting</h3>
                        <p className="why-card-desc">Challenges are logged the same day they occur — giving supervisors a chance to intervene before things escalate.</p>
                    </div>

                    <div className="why-card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="why-card-icon">🎯</div>
                        <h3 className="why-card-title">Team Accountability</h3>
                        <p className="why-card-desc">When reporting is structured and automated, teams stay focused. Everyone knows their work is visible and valued.</p>
                    </div>

                    <div className="why-card">
                        <div className="why-card-icon">📬</div>
                        <h3 className="why-card-title">Zero Manual Forwarding</h3>
                        <p className="why-card-desc">Reports go directly to the right inboxes. No copying, no forwarding — the system handles all delivery automatically.</p>
                    </div>
                </div>
            </section>

            {/* EMAIL FLOW */}
            <section className="email-section">
                <div>
                    <p className="section-eyebrow">Automatic Delivery</p>
                    <h2 className="section-title display">The right people, always in the loop</h2>
                    <p className="section-subtitle">
                        Every submitted report is automatically dispatched to your primary supervisor and CC'd to all relevant team leads — no manual intervention needed.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {[
                            'Report submitted once — delivered everywhere',
                            'Primary supervisor receives it directly',
                            'All other supervisors receive a CC copy',
                            'Delivery confirmed, no follow-up needed',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--ink-soft)' }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                    <circle cx="7" cy="7" r="6" fill="var(--accent-pale)"/>
                                    <path d="M4 7l2 2 4-4" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="email-visual">
                    {/* Reporter */}
                    <div className="email-item">
                        <div className="email-avatar" style={{ background: '#6366f1' }}>JM</div>
                        <div className="email-meta">
                            <div className="email-name">Jane Mugisha</div>
                            <div className="email-role">Team Member · Submits report</div>
                        </div>
                        <span className="email-badge" style={{ background: '#f0f0fe', color: '#6366f1' }}>Sender</span>
                    </div>

                    <div className="email-connector">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <div style={{ width: 1, height: 10, background: 'var(--line)' }} />
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1l5 5 5-5" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>

                    {/* Main supervisor */}
                    <div className="email-item" style={{ borderColor: 'rgba(200,64,10,0.2)', boxShadow: '0 2px 12px rgba(200,64,10,0.07)' }}>
                        <div className="email-avatar" style={{ background: 'var(--accent)' }}>RO</div>
                        <div className="email-meta">
                            <div className="email-name">Robert Okello</div>
                            <div className="email-role">Head Supervisor · Primary recipient</div>
                        </div>
                        <span className="email-badge badge-to">TO</span>
                    </div>

                    <div className="email-connector">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <div style={{ width: 1, height: 10, background: 'var(--line)' }} />
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1l5 5 5-5" stroke="var(--green)" strokeWidth="1.3" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>

                    {/* CC supervisors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            { initials: 'AN', name: 'Aisha Nakato', role: 'Operations Supervisor' },
                            { initials: 'PK', name: 'Paul Kato', role: 'Finance Supervisor' },
                        ].map((sv, i) => (
                            <div key={i} className="email-item">
                                <div className="email-avatar" style={{ background: i === 0 ? '#0f766e' : '#1a6a3a' }}>{sv.initials}</div>
                                <div className="email-meta">
                                    <div className="email-name">{sv.name}</div>
                                    <div className="email-role">{sv.role}</div>
                                </div>
                                <span className="email-badge badge-cc">CC</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-brand">
                    <div className="nav-logo-dot" />
                    <span className="display">DailyReport</span>
                </div>
                <span className="footer-copy">Keeping every supervisor informed, every single day.</span>
            </footer>
        </>
    );
}