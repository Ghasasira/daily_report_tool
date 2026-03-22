import { Head, Link } from '@inertiajs/react';
import { ClipboardList, CheckCircle, Clock, XCircle, ChevronRight, Plus, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import reportsRoute from '@/routes/reports';

interface Report {
    id: number;
    report_date: string;
    tasks_handled: string[];
    tasks_completed: string[];
    challenges: string | null;
    email_status: 'pending' | 'sent' | 'failed' | 'draft';
    created_at: string;
}

interface PaginatedReports {
    data: Report[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    reports: PaginatedReports;
}

const EMAIL_STATUS = {
    sent: {
        icon: CheckCircle,
        label: 'Sent',
        className: 'text-emerald-600 dark:text-emerald-400',
        dot: 'bg-emerald-500',
    },
    pending: {
        icon: Clock,
        label: 'Pending',
        className: 'text-amber-600 dark:text-amber-400',
        dot: 'bg-amber-500',
    },
    failed: {
        icon: XCircle,
        label: 'Failed',
        className: 'text-red-600 dark:text-red-400',
        dot: 'bg-red-500',
    },
    draft: {
        icon: FileText,
        label: 'Draft',
        className: 'text-zinc-600 dark:text-zinc-400',
        dot: 'bg-zinc-500',
    },
} as const;

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatDateShort(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

export default function Index({ reports }: Props) {
    const total = reports.data.length;

    return (
        <AppLayout>
            <Head title="My Reports" />

            <div className="min-h-screen w-full p-2 bg-zinc-50 dark:bg-zinc-950">
                <div className="mx-auto px-4 sm:px-6 py-8 sm:py-12">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-8 sm:mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-zinc-400" />
                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Reports</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                My reports
                            </h1>
                            {total > 0 && (
                                <p className="text-sm text-zinc-500 mt-1">
                                    {total} {total === 1 ? 'report' : 'reports'} · Page {reports.current_page} of {reports.last_page}
                                </p>
                            )}
                        </div>
                        <Link
                            href={reportsRoute.create.url()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition flex-shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">New report</span>
                            <span className="sm:hidden">New</span>
                        </Link>
                    </div>

                    {/* List */}
                    {reports.data.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-2 sm:space-y-3">
                            {reports.data.map((report) => (
                                <ReportCard key={report.id} report={report} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {reports.last_page > 1 && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            {reports.prev_page_url ? (
                                <Link
                                    href={reports.prev_page_url}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                                >
                                    ← Previous
                                </Link>
                            ) : <span />}

                            <span className="text-sm text-zinc-400">
                                {reports.current_page} / {reports.last_page}
                            </span>

                            {reports.next_page_url ? (
                                <Link
                                    href={reports.next_page_url}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                                >
                                    Next →
                                </Link>
                            ) : <span />}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

/* ─── ReportCard ────────────────────────────────────────────────────────── */

function ReportCard({ report }: { report: Report }) {
    const status = EMAIL_STATUS[report.email_status];
    const StatusIcon = status.icon;
    const completionRate = report.tasks_handled.length > 0
        ? Math.round((report.tasks_completed.length / report.tasks_handled.length) * 100)
        : 0;

    return (
        <Link
            href={reportsRoute.show.url(report.id)}
            className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 sm:px-5 py-4 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition group"
        >
            {/* Date block */}
            <div className="flex-shrink-0 w-12 sm:w-14 text-center">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider leading-none">
                    {new Date(report.report_date).toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight tabular-nums">
                    {new Date(report.report_date).getDate()}
                </p>
                <p className="text-[10px] text-zinc-400 leading-none">
                    {new Date(report.report_date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0" />

            {/* Main info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-1">
                    <span className="hidden sm:inline">{formatDate(report.report_date)}</span>
                    <span className="sm:hidden">{formatDateShort(report.report_date)}</span>
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-xs text-zinc-500">
                        {report.tasks_handled.length} handled
                        <span className="mx-1 text-zinc-300 dark:text-zinc-700">·</span>
                        {report.tasks_completed.length} done
                    </p>
                    {report.tasks_handled.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-zinc-400 tabular-nums">{completionRate}%</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Status + chevron */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${status.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{status.label}</span>
                </div>
                <div className={`sm:hidden w-2 h-2 rounded-full flex-shrink-0 ${status.dot}`} />
                <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition" />
            </div>
        </Link>
    );
}

/* ─── EmptyState ────────────────────────────────────────────────────────── */

function EmptyState() {
    return (
        <div className="text-center py-16 sm:py-20 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
            </div>
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">No reports yet</p>
            <p className="text-xs text-zinc-400 mb-6">Submit your first daily report to get started.</p>
            <Link
                href={reportsRoute.create.url()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
            >
                <Plus className="w-4 h-4" />
                Submit today's report
            </Link>
        </div>
    );
}
