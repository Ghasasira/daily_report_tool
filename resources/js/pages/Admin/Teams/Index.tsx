import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Crown, Mail, Users, LayoutGrid, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import teamsRoute from '@/routes/teams';
import { Badge, EmptyState, FlashBanner, StatCard, ConfirmButton } from '@/components/Admin/ui';

interface Supervisor {
    id: number;
    name: string;
    email: string;
}

interface Team {
    id: number;
    name: string;
    description: string | null;
    members_count: number;
    primary_supervisor: Supervisor | null;
    supervisors: Supervisor[];
}

interface Props {
    teams: Team[];
    stats: {
        total_teams: number;
        total_supervisors: number;
        unassigned_users: number;
    };
}

export default function TeamsIndex({ teams, stats }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const destroy = (team: Team) => {
        router.delete(teamsRoute.destroy.url(team.id), { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title="Admin — Teams" />

            <div className='w-full p-2'>

            {flash?.success && <FlashBanner message={flash.success} type="success" />}
            {flash?.error   && <FlashBanner message={flash.error}   type="error"   />}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard label="Total teams"       value={stats.total_teams}       icon={<LayoutGrid className="w-4 h-4" />} />
                <StatCard label="Supervisors"       value={stats.total_supervisors} icon={<Crown className="w-4 h-4" />} />
                <StatCard label="Unassigned users"  value={stats.unassigned_users}  sub="No team yet" icon={<Users className="w-4 h-4" />} />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-zinc-500">
                    {teams.length} {teams.length === 1 ? 'team' : 'teams'}
                </p>
                <Link
                    href={teamsRoute.create.url()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
                >
                    <Plus className="w-4 h-4" />
                    New team
                </Link>
            </div>

            {teams.length === 0 ? (
                <EmptyState
                    icon={<LayoutGrid className="w-10 h-10" />}
                    title="No teams yet"
                    description="Create your first team and assign supervisors and members."
                    action={
                        <Link
                            href={teamsRoute.create.url()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
                        >
                            <Plus className="w-4 h-4" /> New team
                        </Link>
                    }
                />
            ) : (
                <div className="bg-white dark:bg-[#1a1a19] rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                {['Team', 'Primary supervisor', 'Other supervisors', 'Members', ''].map((h) => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                            {teams.map((team) => {
                                // Derive CC supervisors client-side by excluding the primary
                                const ccSupervisors = team.supervisors.filter(
                                    (s) => s.id !== team.primary_supervisor?.id
                                );

                                return (
                                    <tr key={team.id} className="group hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">

                                        {/* Name */}
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{team.name}</p>
                                            {team.description && (
                                                <p className="text-xs text-zinc-400 mt-0.5 max-w-[180px] truncate">{team.description}</p>
                                            )}
                                        </td>

                                        {/* Primary supervisor */}
                                        <td className="px-5 py-4">
                                            {team.primary_supervisor ? (
                                                <div className="flex items-center gap-2.5">
                                                    <InitialAvatar name={team.primary_supervisor.name} />
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                            {team.primary_supervisor.name}
                                                        </p>
                                                        <p className="text-xs text-zinc-400">{team.primary_supervisor.email}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Badge variant="red">Unassigned</Badge>
                                            )}
                                        </td>

                                        {/* Other supervisors (CC) */}
                                        <td className="px-5 py-4">
                                            {ccSupervisors.length === 0 ? (
                                                <span className="text-xs text-zinc-400 italic">None</span>
                                            ) : (
                                                <div className="space-y-1">
                                                    {ccSupervisors.slice(0, 2).map((s) => (
                                                        <div key={s.id} className="flex items-center gap-1.5">
                                                            <Mail className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                                                            <span className="text-xs text-zinc-600 dark:text-zinc-400">{s.name}</span>
                                                        </div>
                                                    ))}
                                                    {ccSupervisors.length > 2 && (
                                                        <span className="text-xs text-zinc-400">+{ccSupervisors.length - 2} more</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* Members */}
                                        <td className="px-5 py-4">
                                            <Badge variant="slate">
                                                <Users className="w-3 h-3" />
                                                &nbsp;{team.members_count}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={teamsRoute.show.url(team.id)}
                                                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View
                                                </Link>
                                                <Link
                                                    href={teamsRoute.edit.url(team.id)}
                                                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    Edit
                                                </Link>
                                                <ConfirmButton
                                                    onConfirm={() => destroy(team)}
                                                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </ConfirmButton>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </AppLayout>
    );
}

function InitialAvatar({ name }: { name: string }) {
    return (
        <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex-shrink-0">
            {name.charAt(0).toUpperCase()}
        </span>
    );
}
