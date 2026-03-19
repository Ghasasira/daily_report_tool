import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import {
    Users,
    Shield,
    LayoutGrid,
    FileText,
    ChevronRight,
    LogOut,
} from 'lucide-react';

interface Props {
    children: ReactNode;
    title?: string;
    breadcrumbs?: { label: string; href?: string }[];
}

const NAV = [
    { label: 'Teams',    href: 'admin.teams.index', icon: LayoutGrid },
    { label: 'Users',    href: 'admin.users.index', icon: Users      },
    { label: 'Reports',  href: 'reports.index',     icon: FileText   },
];

export default function AdminLayout({ children, title, breadcrumbs }: Props) {
    const { url, props } = usePage<{ auth: { user: { name: string; email: string } } }>();
    const user = props.auth.user;

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <aside className="w-56 flex-shrink-0 bg-[#0f0f0f] flex flex-col border-r border-white/[0.06]">

                {/* Wordmark */}
                <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-white flex items-center justify-center flex-shrink-0">
                            <Shield className="w-3.5 h-3.5 text-black" />
                        </div>
                        <span className="text-white text-sm font-semibold tracking-tight">
                            Admin
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {NAV.map(({ label, href, icon: Icon }) => {
                        const active = url.startsWith('/' + href.replace('.', '/').replace('.index', '').replace('.', '/'));
                        return (
                            <Link
                                key={href}
                                href={route(href)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    active
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + logout */}
                <div className="px-3 py-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/60">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/80 flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white/80 truncate">{user.name}</p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors mt-1"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </Link>
                </div>
            </aside>

            {/* ── Main content ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#fafaf9] dark:bg-[#111110]">

                {/* Top bar */}
                {(title || breadcrumbs) && (
                    <header className="px-8 pt-8 pb-0">
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2">
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={i} className="flex items-center gap-1.5">
                                        {i > 0 && <ChevronRight className="w-3 h-3" />}
                                        {crumb.href ? (
                                            <Link href={crumb.href} className="hover:text-zinc-700 dark:hover:text-zinc-200 transition">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-zinc-600 dark:text-zinc-300">{crumb.label}</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                        {title && (
                            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                                {title}
                            </h1>
                        )}
                    </header>
                )}

                {/* Page body */}
                <main className="flex-1 px-8 py-6">
                    {children}
                </main>
            </div>

        </div>
    );
}
