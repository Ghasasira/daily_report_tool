import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, AlertCircle, Send, ClipboardList, ChevronRight, ArrowRight } from 'lucide-react';
import TaskListInput from '@/components/TaskListInput';
import AppLayout from '@/layouts/app-layout';
import reports from '@/routes/reports';

interface TodaysReport {
    id: number;
    report_date: string;
    tasks_handled: string[];
    tasks_completed: string[];
    challenges: string | null;
    next_day_plan: string | null;
    additional_notes: string | null;
    email_status: 'pending' | 'sent' | 'failed';
    created_at: string;
}

interface Props {
    todaysReport: TodaysReport | null;
    hasTeam: boolean;
    teamName: string | null;
}

type ReportFormData = {
    tasks_handled: string[];
    tasks_completed: string[];
    challenges: string;
    next_day_plan: string;
    additional_notes: string;
};

const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

const shortDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

export default function Create({ todaysReport, hasTeam, teamName }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const { data, setData, post, processing, errors } = useForm<ReportFormData>({
        tasks_handled: [],
        tasks_completed: [],
        challenges: '',
        next_day_plan: '',
        additional_notes: '',
    });

    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(reports.store.url());
    };

    if (todaysReport) {
        return (
            <AppLayout>
                <Head title="Daily Report" />
                <PageShell>
                    <AlreadySubmitted report={todaysReport} teamName={teamName} />
                </PageShell>
            </AppLayout>
        );
    }

    if (!hasTeam) {
        return (
            <AppLayout>
                <Head title="Daily Report" />
                <PageShell>
                    <NoTeamWarning />
                </PageShell>
            </AppLayout>
        );
    }

    const sections = [
        { number: '01', title: 'Tasks handled', description: 'Everything you worked on today.' },
        { number: '02', title: 'Completed today', description: 'What you fully finished.' },
        { number: '03', title: 'Challenges & blockers', description: 'What slowed you down.' },
        { number: '04', title: 'Plan for tomorrow', description: 'Priorities for the next day.' },
        { number: '05', title: 'Additional notes', description: 'Anything else to mention.', optional: true },
    ];

    return (
        <AppLayout>
            <Head title="Submit Daily Report" />

            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
                {/* Top banner */}
                <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0">
                                <ClipboardList className="w-4 h-4 text-white dark:text-zinc-900" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest leading-none mb-0.5">
                                    {teamName}
                                </p>
                                <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                                    Daily Report
                                </h1>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 sm:text-right">
                            <span className="hidden sm:inline">{today}</span>
                            <span className="sm:hidden">{shortDate}</span>
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    {/* Progress strip */}
                    <div className="hidden sm:flex items-center gap-1 mb-10">
                        {sections.map((s, i) => (
                            <div key={s.number} className="flex items-center gap-1 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono text-zinc-400">{s.number}</span>
                                    <div className="h-1 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                </div>
                                {i < sections.length - 1 && (
                                    <ArrowRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 flex-shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Flash */}
                    {flash?.success && (
                        <div className="mb-6 flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl px-4 py-3 text-sm">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {flash.success}
                        </div>
                    )}

                    {/* Errors */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="space-y-0.5">
                                {Object.values(errors).map((e, i) => e && <p key={i}>{e}</p>)}
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit}>
                        {/* Two-column on large, single on mobile */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

                            {/* 01 — Tasks handled */}
                            <FormCard number="01" title="Tasks handled" description="List everything you worked on today." accent="zinc">
                                <TaskListInput
                                    label="Tasks handled today"
                                    value={data.tasks_handled}
                                    onChange={(val) => setData('tasks_handled', val)}
                                    placeholder="e.g. Reviewed pull request #42"
                                    error={errors.tasks_handled}
                                    accentColor="#18181b"
                                />
                            </FormCard>

                            {/* 02 — Completed */}
                            <FormCard number="02" title="Completed today" description="What did you fully finish?" accent="green">
                                <TaskListInput
                                    label="Completed tasks"
                                    value={data.tasks_completed}
                                    onChange={(val) => setData('tasks_completed', val)}
                                    placeholder="e.g. Deployed hotfix to production"
                                    error={errors.tasks_completed}
                                    accentColor="#16a34a"
                                />
                            </FormCard>

                            {/* 03 — Challenges */}
                            <FormCard number="03" title="Challenges & blockers" description="Anything that slowed you down or needs attention." accent="amber">
                                <textarea
                                    rows={4}
                                    value={data.challenges}
                                    onChange={(e) => setData('challenges', e.target.value)}
                                    placeholder="Describe any obstacles you encountered..."
                                    className="w-full text-sm px-3 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition resize-none"
                                />
                                {errors.challenges && (
                                    <p className="text-xs text-red-600 mt-1">{errors.challenges}</p>
                                )}
                            </FormCard>

                            {/* 04 — Plan */}
                            <FormCard number="04" title="Plan for tomorrow" description="What are your priorities for the next working day?" accent="blue">
                                <textarea
                                    rows={4}
                                    value={data.next_day_plan}
                                    onChange={(e) => setData('next_day_plan', e.target.value)}
                                    placeholder="Outline your plan for tomorrow..."
                                    className="w-full text-sm px-3 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition resize-none"
                                />
                                {errors.next_day_plan && (
                                    <p className="text-xs text-red-600 mt-1">{errors.next_day_plan}</p>
                                )}
                            </FormCard>

                            {/* 05 — Notes (full width) */}
                            <div className="lg:col-span-2">
                                <FormCard number="05" title="Additional notes" description="Anything else your supervisor should know." accent="zinc" optional>
                                    <textarea
                                        rows={3}
                                        value={data.additional_notes}
                                        onChange={(e) => setData('additional_notes', e.target.value)}
                                        placeholder="Any other notes..."
                                        className="w-full text-sm px-3 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition resize-none"
                                    />
                                </FormCard>
                            </div>
                        </div>

                        {/* Submit bar */}
                        <div className="mt-6 sm:mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                                Your report will be emailed to your supervisor immediately after submission.
                            </p>
                            <button
                                type="submit"
                                disabled={processing || data.tasks_handled.length === 0}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition w-full sm:w-auto"
                            >
                                <Send className="w-4 h-4" />
                                {processing ? 'Submitting…' : 'Submit report'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

/* ─── Layout shell ──────────────────────────────────────────────────────── */

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                {children}
            </div>
        </div>
    );
}

/* ─── FormCard ──────────────────────────────────────────────────────────── */

const accentMap: Record<string, string> = {
    zinc:  'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
    green: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    blue:  'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
};

function FormCard({
    number,
    title,
    description,
    accent = 'zinc',
    optional = false,
    children,
}: {
    number: string;
    title: string;
    description?: string;
    accent?: string;
    optional?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${accentMap[accent]}`}>
                        {number}
                    </span>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            {title}
                            {optional && (
                                <span className="text-[10px] font-normal text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5">
                                    optional
                                </span>
                            )}
                        </h3>
                        {description && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
                        )}
                    </div>
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
}

/* ─── AlreadySubmitted ──────────────────────────────────────────────────── */

function AlreadySubmitted({ report, teamName }: { report: TodaysReport; teamName: string | null }) {
    const statusConfig = {
        pending: {
            bar: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
            label: 'Email is queued and will be sent shortly',
        },
        sent: {
            bar: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
            label: 'Email delivered to your supervisor',
        },
        failed: {
            bar: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
            label: 'Email delivery failed — contact your admin',
        },
    };

    const cfg = statusConfig[report.email_status];

    return (
        <div className="space-y-6">
            {teamName && (
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{teamName}</p>
            )}
            <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    Report submitted ✓
                </h1>
                <p className="text-sm text-zinc-500 mt-1">{today}</p>
            </div>

            <div className={`rounded-xl border px-4 py-3 text-sm ${cfg.bar}`}>
                {cfg.label}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {[
                    { label: 'Tasks handled', value: `${report.tasks_handled.length} task${report.tasks_handled.length !== 1 ? 's' : ''}` },
                    { label: 'Completed', value: `${report.tasks_completed.length} task${report.tasks_completed.length !== 1 ? 's' : ''}` },
                    { label: 'Challenges', value: report.challenges ? 'Reported' : 'None' },
                    { label: "Tomorrow's plan", value: report.next_day_plan ? 'Provided' : 'Not provided' },
                ].map((row, i, arr) => (
                    <div
                        key={row.label}
                        className={`flex justify-between items-center px-5 py-3.5 text-sm ${i < arr.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                    >
                        <span className="text-zinc-500">{row.label}</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{row.value}</span>
                    </div>
                ))}
            </div>

            <a
                href={reports.index.url()}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            >
                View all my reports
                <ChevronRight className="w-4 h-4" />
            </a>
        </div>
    );
}

/* ─── NoTeamWarning ─────────────────────────────────────────────────────── */

function NoTeamWarning() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Not assigned to a team
            </h1>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                You need to be assigned to a team before you can submit reports. Please contact your administrator.
            </div>
        </div>
    );
}
