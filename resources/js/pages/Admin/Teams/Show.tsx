import { Head, Link, router } from '@inertiajs/react';
import {
    Crown, Mail, Users, FileText, CheckCircle,
    Clock, XCircle, Pencil, AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import reports from '@/routes/reports';
import teams from '@/routes/teams';

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface SupervisorInfo {
    id: number;
    name: string;
    email: string;
}

interface Team {
    id: number;
    name: string;
    description: string | null;
    primary_supervisor: SupervisorInfo | null;
    cc_supervisors: SupervisorInfo[];
}

interface MemberStat {
    id: number;
    name: string;
    email: string;
    total_reports: number;
    recent_reports: number;   // last 30 days
    last_report: string | null;
}

interface RecentReport {
    id: number;
    report_date: string;
    email_status: 'pending' | 'sent' | 'failed';
    tasks_handled: number;
    tasks_completed: number;
    user: { id: number; name: string; email: string };
}

interface Props {
    team: Team;
    memberStats: MemberStat[];
    recentReports: RecentReport[];
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
    });
}

function daysAgo(dateStr: string) {
    const diff = Math.round(
        (Date.now() - new Date(dateStr).getTime()) / 86_400_000
    );

    if (diff === 0) {
        return 'Today';
    }

    if (diff === 1) {
        return 'Yesterday';
    }

    return `${diff}d ago`;
}

const EMAIL_STATUS = {
    sent:    { icon: CheckCircle, label: 'Sent',    cls: 'text-emerald-500' },
    pending: { icon: Clock,       label: 'Pending', cls: 'text-amber-500'   },
    failed:  { icon: XCircle,     label: 'Failed',  cls: 'text-red-500'     },
};

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function TeamShow({ team, memberStats, recentReports }: Props) {
    const totalReports30d = recentReports.length;
    const sentCount       = recentReports.filter((r) => r.email_status === 'sent').length;
    const failedCount     = recentReports.filter((r) => r.email_status === 'failed').length;

    return (
        <AppLayout
            // title={team.name}
            // breadcrumbs={[
            //     { label: 'Admin' },
            //     { label: 'Teams', href: teams.index') },
            //     { label: team.name },
            // ]}
        >
            <Head title={`${team.name} — Admin`} />

            <div className="w-full p-2">
            {/* ── Header bar ──────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    {team.description && (
                        <p className="text-sm text-zinc-500 mt-1">{team.description}</p>
                    )}
                </div>
                <Link
                    href={teams.edit.url(team.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit team
                </Link>
            </div>

            {/* ── Top stats ───────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatTile
                    label="Members"
                    value={memberStats.length}
                    icon={<Users className="w-4 h-4" />}
                />
                <StatTile
                    label="Reports (30d)"
                    value={totalReports30d}
                    icon={<FileText className="w-4 h-4" />}
                />
                <StatTile
                    label="Emails sent"
                    value={sentCount}
                    icon={<CheckCircle className="w-4 h-4" />}
                    positive
                />
                {failedCount > 0 ? (
                    <StatTile
                        label="Emails failed"
                        value={failedCount}
                        icon={<AlertCircle className="w-4 h-4" />}
                        negative
                    />
                ) : (
                    <StatTile
                        label="CC supervisors"
                        value={team.cc_supervisors.length}
                        icon={<Mail className="w-4 h-4" />}
                    />
                )}
            </div>

            {/* ── Two-column layout ────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-6">

                {/* ── Left: supervisors + members ─────────────────────── */}
                <div className="col-span-1 space-y-6">

                    {/* Supervisors card */}
                    <Card title="Supervisors">
                        {/* Primary */}
                        {team.primary_supervisor ? (
                            <SupervisorRow
                                supervisor={team.primary_supervisor}
                                badge={
                                    <Badge variant="outline">
                                        <Crown className="w-3 h-3" />&nbsp;Primary
                                    </Badge>
                                }
                            />
                        ) : (
                            <p className="text-xs text-red-400 px-4 py-3">
                                No primary supervisor assigned.
                            </p>
                        )}

                        {/* CC supervisors */}
                        {team.cc_supervisors.length > 0 && (
                            <>
                                <div className="border-t border-zinc-100 dark:border-zinc-800 mx-4" />
                                {team.cc_supervisors.map((s) => (
                                    <SupervisorRow
                                        key={s.id}
                                        supervisor={s}
                                        badge={
                                            <Badge variant="outline">
                                                <Mail className="w-3 h-3" />&nbsp;CC
                                            </Badge>
                                        }
                                    />
                                ))}
                            </>
                        )}

                        {team.primary_supervisor === null && team.cc_supervisors.length === 0 && (
                            <p className="text-xs text-zinc-400 italic px-4 py-3">
                                No supervisors assigned.
                            </p>
                        )}
                    </Card>

                    {/* Members card */}
                    <Card
                        title="Members"
                        action={
                            <span className="text-xs text-zinc-400">
                                {memberStats.length} total
                            </span>
                        }
                    >
                        {memberStats.length === 0 ? (
                            <p className="text-xs text-zinc-400 italic px-4 py-3">
                                No members assigned.
                            </p>
                        ) : (
                            memberStats.map((member) => (
                                <MemberRow key={member.id} member={member} />
                            ))
                        )}
                    </Card>
                </div>

                {/* ── Right: recent reports feed ──────────────────────── */}
                <div className="col-span-2">
                    <Card
                        title="Recent reports"
                        action={
                            <span className="text-xs text-zinc-400">Last 30 days</span>
                        }
                    >
                        {recentReports.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
                                <p className="text-sm text-zinc-400">No reports submitted yet.</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                        {['Date', 'Member', 'Tasks', 'Email'].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-400"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                                    {recentReports.map((report) => {
                                        const status = EMAIL_STATUS[report.email_status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <tr
                                                key={report.id}
                                                className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                                                onClick={() =>
                                                    router.visit(reports.show.url(report.id))
                                                }
                                            >
                                                {/* Date */}
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                                                        {formatDate(report.report_date)}
                                                    </p>
                                                    <p className="text-xs text-zinc-400">
                                                        {daysAgo(report.report_date)}
                                                    </p>
                                                </td>

                                                {/* Member */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                                                            {report.user.name.charAt(0)}
                                                        </span>
                                                        <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[120px]">
                                                            {report.user.name}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Tasks */}
                                                <td className="px-4 py-3">
                                                    <p className="text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                                                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                                            {report.tasks_completed}
                                                        </span>
                                                        <span className="text-zinc-400">/{report.tasks_handled}</span>
                                                        <span className="text-xs text-zinc-400 ml-1">done</span>
                                                    </p>
                                                </td>

                                                {/* Email status */}
                                                <td className="px-4 py-3">
                                                    <div className={`flex items-center gap-1.5 text-xs font-medium ${status.cls}`}>
                                                        <StatusIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                                        {status.label}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </Card>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function StatTile({
    label, value, icon, positive, negative,
}: {
    label: string;
    value: number;
    icon?: React.ReactNode;
    positive?: boolean;
    negative?: boolean;
}) {
    const valCls = negative
        ? 'text-red-600 dark:text-red-400'
        : positive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-zinc-900 dark:text-zinc-100';

    return (
        <div className="bg-white dark:bg-[#1a1a19] rounded-xl border border-zinc-200 dark:border-zinc-800 px-5 py-4">
            <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</p>
                <span className="text-zinc-300 dark:text-zinc-600">{icon}</span>
            </div>
            <p className={`text-2xl font-semibold tracking-tight ${valCls}`}>{value}</p>
        </div>
    );
}

function Card({
    title,
    action,
    children,
}: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-[#1a1a19] rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    {title}
                </h2>
                {action}
            </div>
            <div>{children}</div>
        </div>
    );
}

function SupervisorRow({
    supervisor,
    badge,
}: {
    supervisor: SupervisorInfo;
    badge: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                {supervisor.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {supervisor.name}
                </p>
                <p className="text-xs text-zinc-400 truncate">{supervisor.email}</p>
            </div>
            <div className="flex-shrink-0">{badge}</div>
        </div>
    );
}

function MemberRow({ member }: { member: MemberStat }) {
    const hasRecentActivity = member.recent_reports > 0;
    const lastReportLabel = member.last_report
        ? daysAgo(member.last_report)
        : null;

    return (
        <div className="flex items-center gap-3 px-4 py-3 group">
            <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                {member.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {member.name}
                </p>
                {lastReportLabel ? (
                    <p className="text-xs text-zinc-400">
                        Last report: {lastReportLabel}
                    </p>
                ) : (
                    <p className="text-xs text-zinc-400 italic">No reports yet</p>
                )}
            </div>
            <div className="text-right flex-shrink-0">
                <p className={`text-sm font-semibold tabular-nums ${hasRecentActivity ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400'}`}>
                    {member.recent_reports}
                </p>
                <p className="text-[10px] text-zinc-400">30d</p>
            </div>
        </div>
    );
}
