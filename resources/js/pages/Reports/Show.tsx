import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, XCircle, Mail, Calendar, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import reports from '@/routes/reports';

interface Report {
    id: number;
    report_date: string;
    tasks_handled: string[];
    tasks_completed: string[];
    challenges: string | null;
    next_day_plan: string | null;
    additional_notes: string | null;
    email_status: 'pending' | 'sent' | 'failed';
    email_sent_at: string | null;
    created_at: string;
    user: { name: string; email: string };
    team: { name: string };
}

interface Props {
    report: Report;
}

const EMAIL_BADGE = {
    sent: {
        icon: CheckCircle,
        label: 'Email delivered',
        className: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
    },
    pending: {
        icon: Clock,
        label: 'Email queued',
        className: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    },
    failed: {
        icon: XCircle,
        label: 'Email delivery failed',
        className: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    },
} as const;

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function Show({ report }: Props) {
    const badge = EMAIL_BADGE[report.email_status];
    const BadgeIcon = badge.icon;

    const completionRate = report.tasks_handled.length > 0
        ? Math.round((report.tasks_completed.length / report.tasks_handled.length) * 100)
        : 0;

    return (
        <AppLayout>
            <Head title={`Report — ${formatDate(report.report_date)}`} />

            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                    {/* Back nav */}
                    <Link
                        href={reports.index.url()}
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition mb-6 sm:mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        All reports
                    </Link>

                    {/* Header card */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 mb-4 sm:mb-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">
                                    {report.team.name}
                                </p>
                                <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                    {formatDate(report.report_date)}
                                </h1>

                                {/* Meta row */}
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                        <User className="w-3.5 h-3.5" />
                                        {report.user.name}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {report.email_sent_at && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                            <Mail className="w-3.5 h-3.5" />
                                            Sent at {new Date(report.email_sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email status pill */}
                            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 text-xs font-medium flex-shrink-0 self-start ${badge.className}`}>
                                <BadgeIcon className="w-3.5 h-3.5" />
                                {badge.label}
                            </div>
                        </div>

                        {/* Completion bar */}
                        {report.tasks_handled.length > 0 && (
                            <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-zinc-500">Task completion</span>
                                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                        {report.tasks_completed.length} / {report.tasks_handled.length} ({completionRate}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{ width: `${completionRate}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content sections — 2-col on md+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                        {/* Tasks handled */}
                        <ContentCard title="Tasks handled" count={report.tasks_handled.length}>
                            {report.tasks_handled.length > 0 ? (
                                <TaskList items={report.tasks_handled} bulletColor="#18181b" darkBulletColor="#e4e4e7" />
                            ) : <Empty />}
                        </ContentCard>

                        {/* Completed */}
                        <ContentCard title="Completed today" count={report.tasks_completed.length} countColor="emerald">
                            {report.tasks_completed.length > 0 ? (
                                <TaskList items={report.tasks_completed} bulletColor="#16a34a" darkBulletColor="#16a34a" />
                            ) : <Empty />}
                        </ContentCard>

                        {/* Challenges */}
                        <ContentCard title="Challenges & blockers">
                            {report.challenges ? (
                                <Prose text={report.challenges} />
                            ) : <Empty />}
                        </ContentCard>

                        {/* Plan */}
                        <ContentCard title="Plan for tomorrow">
                            {report.next_day_plan ? (
                                <Prose text={report.next_day_plan} />
                            ) : <Empty />}
                        </ContentCard>

                        {/* Notes — full width only if present */}
                        {report.additional_notes && (
                            <div className="md:col-span-2">
                                <ContentCard title="Additional notes">
                                    <Prose text={report.additional_notes} />
                                </ContentCard>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ─── ContentCard ───────────────────────────────────────────────────────── */

function ContentCard({
    title,
    count,
    countColor = 'zinc',
    children,
}: {
    title: string;
    count?: number;
    countColor?: 'zinc' | 'emerald';
    children: React.ReactNode;
}) {
    const countStyles = {
        zinc:    'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
        emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400',
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {title}
                </h2>
                {count !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums ${countStyles[countColor]}`}>
                        {count}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

/* ─── TaskList ──────────────────────────────────────────────────────────── */

function TaskList({ items, bulletColor }: { items: string[]; bulletColor: string; darkBulletColor: string }) {
    return (
        <ul className="space-y-2.5">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[7px]"
                        style={{ backgroundColor: bulletColor }}
                    />
                    {item}
                </li>
            ))}
        </ul>
    );
}

function Prose({ text }: { text: string }) {
    return (
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {text}
        </p>
    );
}

function Empty() {
    return <p className="text-sm text-zinc-400 italic">Not provided</p>;
}
