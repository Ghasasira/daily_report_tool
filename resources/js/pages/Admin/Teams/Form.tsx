import { Head, Link, useForm } from '@inertiajs/react';
import { Crown, Mail, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import teamsRoute from '@/routes/teams';
import type { Person } from '@/components/Admin/PersonPicker';
import PersonPicker from '@/components/Admin/PersonPicker';
import { Field, SectionHeading, inputCls } from '@/components/Admin/ui';

interface TeamFormData {
    id?: number;
    name: string;
    description: string | null;
    primary_supervisor_id: number | null;
    cc_supervisor_ids: number[];
    member_ids: number[];
}

interface Props {
    team: TeamFormData | null;
    supervisors: Person[];
    /** All non-admin users available for team membership */
    members: (Person & { team_name?: string | null })[];
}

export default function TeamForm({ team, supervisors, members }: Props) {
    const isEditing = !!team;

    const { data, setData, post, put, processing, errors } = useForm({
        name:                  team?.name ?? '',
        description:           team?.description ?? '',
        primary_supervisor_id: team?.primary_supervisor_id ?? ('' as number | ''),
        cc_supervisor_ids:     (team?.cc_supervisor_ids ?? []) as number[],
        member_ids:            (team?.member_ids ?? []) as number[],
    });

    const submit = (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(isEditing) {
            put(teamsRoute.update.url(team!.id!));
        } else {
            post(teamsRoute.store.url());
        }
       };

    const toggleCc = (id: number) => {
        const current = data.cc_supervisor_ids;
        setData('cc_supervisor_ids',
            current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
        );
    };

    const toggleMember = (id: number) => {
        const current = data.member_ids;
        setData('member_ids',
            current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
        );
    };

    // Exclude selected primary from CC list to prevent duplicates
    const availableCcSupervisors = supervisors.filter(
        (s) => s.id !== Number(data.primary_supervisor_id)
    );

    return (
        <AppLayout
            // title={isEditing ? `Edit "${team!.name}"` : 'New team'}
            // breadcrumbs={[
            //     { label: 'Admin' },
            //     { label: 'Teams', href: route('admin.teams.index') },
            //     { label: isEditing ? team!.name : 'New' },
            // ]}
        >
            <Head title={isEditing ? `Edit Team — ${team!.name}` : 'New Team'} />

            <div className="max-w-2xl p-4">
                <form onSubmit={submit} className="space-y-10">

                    {/* ── Team details ────────────────────────────────── */}
                    <section>
                        <SectionHeading>Team details</SectionHeading>
                        <div className="space-y-4 bg-white dark:bg-[#1a1a19] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                            <Field label="Team name" error={errors.name}>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Engineering"
                                    className={inputCls}
                                    autoFocus
                                />
                            </Field>

                            <Field label="Description" error={errors.description} optional>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="What does this team do?"
                                    className={inputCls}
                                />
                            </Field>
                        </div>
                    </section>

                    {/* ── Primary supervisor ──────────────────────────── */}
                    <section>
                        <SectionHeading sub="Receives report emails as the main To: recipient.">
                            <Crown className="w-3.5 h-3.5 inline mr-1.5 text-amber-500" />
                            Primary supervisor
                        </SectionHeading>
                        <div className="bg-white dark:bg-[#1a1a19] rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                            <Field label="Select primary supervisor" error={errors.primary_supervisor_id as string}>
                                <select
                                title='supervisor'
                                    value={data.primary_supervisor_id}
                                    onChange={(e) =>
                                        setData('primary_supervisor_id', e.target.value ? Number(e.target.value) : '')
                                    }
                                    className={inputCls}
                                >
                                    <option value="">— choose a supervisor —</option>
                                    {supervisors.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} · {s.email}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            {/* Preview selected primary */}
                            {data.primary_supervisor_id && (() => {
                                const s = supervisors.find((x) => x.id === Number(data.primary_supervisor_id));

                                return s ? (
                                    <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                                        <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-sm font-bold text-amber-700 dark:text-amber-300 flex-shrink-0">
                                            {s.name.charAt(0)}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">{s.name}</p>
                                            <p className="text-xs text-amber-600 dark:text-amber-400">{s.email}</p>
                                        </div>
                                        <Crown className="w-4 h-4 text-amber-500 ml-auto" />
                                    </div>
                                ) : null;
                            })()}
                        </div>
                    </section>

                    {/* ── CC supervisors ──────────────────────────────── */}
                    <section>
                        <SectionHeading sub="CC'd on every report email sent from this team.">
                            <Mail className="w-3.5 h-3.5 inline mr-1.5 text-zinc-400" />
                            CC supervisors
                        </SectionHeading>
                        <PersonPicker
                            people={availableCcSupervisors}
                            selectedIds={data.cc_supervisor_ids}
                            onToggle={toggleCc}
                            placeholder="Search supervisors..."
                        />
                        {(errors as any).cc_supervisor_ids && (
                            <p className="text-xs text-red-500 mt-1">{(errors as any).cc_supervisor_ids}</p>
                        )}
                    </section>

                    {/* ── Members ─────────────────────────────────────── */}
                    <section>
                        <SectionHeading sub="Users who will submit daily reports from this team.">
                            <Users className="w-3.5 h-3.5 inline mr-1.5 text-zinc-400" />
                            Team members
                        </SectionHeading>
                        <PersonPicker
                            people={members}
                            selectedIds={data.member_ids}
                            onToggle={toggleMember}
                            placeholder="Search users..."
                            showTeamHint
                        />
                    </section>

                    {/* ── Submit ──────────────────────────────────────── */}
                    <div className="flex items-center gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 transition"
                        >
                            {processing ? 'Saving…' : isEditing ? 'Save changes' : 'Create team'}
                        </button>
                        <Link
                            href={teamsRoute.index.url()}
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
