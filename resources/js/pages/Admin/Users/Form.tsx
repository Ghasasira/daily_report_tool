import { Head, Link, useForm } from '@inertiajs/react';
import { Crown, Shield, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import usersRoute from '@/routes/users';
import { Field, inputCls, SectionHeading } from '@/components/Admin/ui';

interface TeamOption {
    id: number;
    name: string;
}

interface UserFormData {
    id?: number;
    name: string;
    email: string;
    team_id: number | null;
    is_supervisor: boolean;
    is_admin: boolean;
}

interface Props {
    user: UserFormData | null;
    teams: TeamOption[];
}

export default function UserForm({ user, teams }: Props) {
    const isEditing = !!user;
    const [showPass, setShowPass] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        name:          user?.name          ?? '',
        email:         user?.email         ?? '',
        password:      '',
        team_id:       user?.team_id       ?? ('' as number | ''),
        is_supervisor: user?.is_supervisor ?? false,
        is_admin:      user?.is_admin      ?? false,
    });

    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();

        if(isEditing) {
            put(usersRoute.update.url(user!.id!));
        } else {
            post(usersRoute.store.url());
        }

    };

    return (
        <AppLayout>
            <Head title={isEditing ? `Edit User — ${user!.name}` : 'New User'} />

            <div className="max-w-lg p-4">
                <form onSubmit={submit} className="space-y-8">

                    {/* ── Identity ──────────────────────────────────── */}
                    <section>
                        <SectionHeading>Identity</SectionHeading>
                        <div className="bg-white dark:bg-[#1a1a19] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">

                            <Field label="Full name" error={errors.name}>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Jane Doe"
                                    className={inputCls}
                                    autoFocus
                                />
                            </Field>

                            <Field label="Email address" error={errors.email}>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="jane@example.com"
                                    className={inputCls}
                                />
                            </Field>

                            <Field
                                label={isEditing ? 'New password' : 'Password'}
                                error={errors.password}
                                hint={isEditing ? 'Leave blank to keep the existing password.' : undefined}
                                optional={isEditing}
                            >
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder={isEditing ? 'Leave blank to keep current' : 'Min. 8 characters'}
                                        className={inputCls + ' pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                        tabIndex={-1}
                                    >
                                        {showPass
                                            ? <EyeOff className="w-4 h-4" />
                                            : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </Field>

                        </div>
                    </section>

                    {/* ── Team assignment ───────────────────────────── */}
                    <section>
                        <SectionHeading sub="Determines which team's reports this user submits.">
                            Team
                        </SectionHeading>
                        <div className="bg-white dark:bg-[#1a1a19] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                            <Field label="Assign to team" error={errors.team_id as string} optional>
                                <select
                                    title='team'
                                    value={data.team_id}
                                    onChange={(e) =>
                                        setData('team_id', e.target.value ? Number(e.target.value) : '')
                                    }
                                    className={inputCls}
                                >
                                    <option value="">— no team —</option>
                                    {teams.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                    </section>

                    {/* ── Roles ─────────────────────────────────────── */}
                    <section>
                        <SectionHeading sub="Roles control what this user can access.">
                            Roles
                        </SectionHeading>
                        <div className="bg-white dark:bg-[#1a1a19] rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">

                            <RoleRow
                                icon={<Crown className="w-4 h-4 text-amber-500" />}
                                label="Supervisor"
                                description="Can be assigned as a primary or CC supervisor on teams. Will receive report emails."
                                checked={data.is_supervisor}
                                onChange={(v) => setData('is_supervisor', v)}
                            />

                            <RoleRow
                                icon={<Shield className="w-4 h-4 text-violet-500" />}
                                label="Admin"
                                description="Full access to the admin panel — can manage teams, users, and all settings."
                                checked={data.is_admin}
                                onChange={(v) => setData('is_admin', v)}
                            />

                        </div>

                        {/* Role summary pills */}
                        {(data.is_supervisor || data.is_admin) && (
                            <div className="mt-3 flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-zinc-400">Roles assigned:</span>
                                {data.is_supervisor && (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800">
                                        <Crown className="w-3 h-3" /> Supervisor
                                    </span>
                                )}
                                {data.is_admin && (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200 dark:ring-violet-800">
                                        <Shield className="w-3 h-3" /> Admin
                                    </span>
                                )}
                            </div>
                        )}
                    </section>

                    {/* ── Submit ────────────────────────────────────── */}
                    <div className="flex items-center gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 transition"
                        >
                            {processing ? 'Saving…' : isEditing ? 'Save changes' : 'Create user'}
                        </button>
                        <Link
                            href={usersRoute.index.url()}
                            className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
                        >
                            Cancel
                        </Link>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}

/* ─── Role row ─────────────────────────────────────────────────────────── */

function RoleRow({
    icon,
    label,
    description,
    checked,
    onChange,
}: {
    icon: React.ReactNode;
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
            {/* Custom checkbox */}
            <span className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border-[1.5px] transition-all ${
                checked
                    ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100'
                    : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-[#1a1a19]'
            }`}>
                {checked && (
                    <svg viewBox="0 0 10 8" className="w-3 h-3 fill-none stroke-white dark:stroke-zinc-900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 4l3 3 5-6" />
                    </svg>
                )}
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only"
                />
            </span>

            <span className="flex-shrink-0 mt-0.5">{icon}</span>

            <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{description}</p>
            </div>
        </label>
    );
}
