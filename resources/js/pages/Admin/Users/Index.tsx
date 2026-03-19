import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Crown, Shield, Users, UserCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import teamsRoute from '@/routes/teams';
import usersRoute from '@/routes/users';
import { Badge, ConfirmButton, EmptyState, FlashBanner, StatCard } from '@/components/Admin/ui';

interface TeamRef {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_supervisor: boolean;
    is_admin: boolean;
    team: TeamRef | null;
    reports_count: number;
}

interface Props {
    users: User[];
    stats: {
        total_users: number;
        total_supervisors: number;
        total_admins: number;
    };
}

export default function UsersIndex({ users, stats }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const destroy = (user: User) =>
        router.delete(usersRoute.destroy.url(user.id), { preserveScroll: true });

    // const toggleSupervisor = (user: User) =>
    //     router.patch(usersRoute.toggle-supervisor.url(user.id), {}, { preserveScroll: true });

    return (
        <AppLayout
            // title="Users"
            // breadcrumbs={[{ label: 'Admin' }, { label: 'Users' }]}
        >
            <Head title="Admin — Users" />
            <div className='w-full p-2'>

            {flash?.success && <FlashBanner message={flash.success} type="success" />}
            {flash?.error   && <FlashBanner message={flash.error}   type="error"   />}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard label="Total users"   value={stats.total_users}       icon={<Users className="w-4 h-4" />} />
                <StatCard label="Supervisors"   value={stats.total_supervisors} icon={<Crown className="w-4 h-4" />} />
                <StatCard label="Admins"        value={stats.total_admins}      icon={<Shield className="w-4 h-4" />} />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-zinc-500">
                    {users.length} {users.length === 1 ? 'user' : 'users'}
                </p>
                <Link
                    href={usersRoute.create.url()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
                >
                    <Plus className="w-4 h-4" />
                    New user
                </Link>
            </div>

            {users.length === 0 ? (
                <EmptyState
                    icon={<Users className="w-10 h-10" />}
                    title="No users yet"
                    description="Create your first user to get started."
                    action={
                        <Link
                            href={usersRoute.create.url()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
                        >
                            <Plus className="w-4 h-4" /> New user
                        </Link>
                    }
                />
            ) : (
                <div className="bg-white dark:bg-[#1a1a19] rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                {['User', 'Team', 'Roles', 'Reports', ''].map((h) => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">

                                    {/* User info */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-zinc-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Team */}
                                    <td className="px-5 py-4">
                                        {user.team ? (
                                            <Link
                                                href={teamsRoute.edit.url(user.team.id)}
                                                className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition underline underline-offset-2"
                                            >
                                                {user.team.name}
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-zinc-400 italic">No team</span>
                                        )}
                                    </td>

                                    {/* Roles */}
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.is_admin && (
                                                <Badge variant="purple">
                                                    <Shield className="w-3 h-3" />
                                                    &nbsp;Admin
                                                </Badge>
                                            )}
                                            {user.is_supervisor && (
                                                <Badge variant="amber">
                                                    <Crown className="w-3 h-3" />
                                                    &nbsp;Supervisor
                                                </Badge>
                                            )}
                                            {!user.is_admin && !user.is_supervisor && (
                                                <Badge variant="slate">Member</Badge>
                                            )}
                                        </div>
                                    </td>

                                    {/* Reports count */}
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-zinc-500 tabular-nums">
                                            {user.reports_count}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                // onClick={() => toggleSupervisor(user)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                                                title={user.is_supervisor ? 'Remove supervisor role' : 'Promote to supervisor'}
                                            >
                                                <UserCheck className="w-3.5 h-3.5" />
                                                {user.is_supervisor ? 'Demote' : 'Promote'}
                                            </button>
                                            <Link
                                                href={usersRoute.edit.url(user.id)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Edit
                                            </Link>
                                            <ConfirmButton
                                                onConfirm={() => destroy(user)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </ConfirmButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </AppLayout>
    );
}
