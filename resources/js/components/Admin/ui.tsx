import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import type { ReactNode} from 'react';
import { useState } from 'react';

/* ─── Badge ────────────────────────────────────────────────────────────── */

type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'slate';

const BADGE_STYLES: Record<BadgeVariant, string> = {
    green:  'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800',
    amber:  'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800',
    red:    'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800',
    blue:   'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-800',
    purple: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-800',
    slate:  'bg-zinc-100 text-zinc-600 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700',
};

export function Badge({
    children,
    variant = 'slate',
    icon,
}: {
    children: ReactNode;
    variant?: BadgeVariant;
    icon?: ReactNode;
}) {
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ring-1 ${BADGE_STYLES[variant]}`}>
            {icon && <span className="w-3 h-3">{icon}</span>}
            {children}
        </span>
    );
}

/* ─── StatCard ─────────────────────────────────────────────────────────── */

export function StatCard({
    label,
    value,
    sub,
    icon,
}: {
    label: string;
    value: string | number;
    sub?: string;
    icon?: ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-[#1a1a19] rounded-xl border border-zinc-200 dark:border-zinc-800 px-5 py-4">
            <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
                {icon && <span className="text-zinc-300 dark:text-zinc-600">{icon}</span>}
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {value}
            </p>
            {sub && <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>}
        </div>
    );
}

/* ─── FlashBanner ──────────────────────────────────────────────────────── */

type FlashType = 'success' | 'error' | 'info';

const FLASH_STYLES: Record<FlashType, { bg: string; icon: ReactNode }> = {
    success: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
        icon: <CheckCircle className="w-4 h-4 flex-shrink-0" />,
    },
    error: {
        bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
        icon: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
    },
    info: {
        bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
        icon: <Info className="w-4 h-4 flex-shrink-0" />,
    },
};

export function FlashBanner({
    message,
    type = 'success',
}: {
    message: string;
    type?: FlashType;
}) {
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return null;
    }

    const { bg, icon } = FLASH_STYLES[type];

    return (
        <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm mb-6 ${bg}`}>
            {icon}
            <span className="flex-1">{message}</span>
            <button title='make-visible' onClick={() => setVisible(false)} className="opacity-60 hover:opacity-100 transition">
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

/* ─── EmptyState ───────────────────────────────────────────────────────── */

export function EmptyState({
    icon,
    title,
    description,
    action,
}: {
    icon: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl">
            <div className="text-zinc-300 dark:text-zinc-600 mb-4">{icon}</div>
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{title}</p>
            {description && (
                <p className="text-xs text-zinc-400 mt-1 mb-5 max-w-xs">{description}</p>
            )}
            {action}
        </div>
    );
}

/* ─── ConfirmButton ────────────────────────────────────────────────────── */

export function ConfirmButton({
    onConfirm,
    // message = 'Are you sure?',
    children,
    className = '',
}: {
    onConfirm: () => void;
    message?: string;
    children: ReactNode;
    className?: string;
}) {
    const [pending, setPending] = useState(false);

    if (pending) {
        return (
            <span className="inline-flex items-center gap-2 text-xs">
                <button
                    onClick={() => {
                        onConfirm(); setPending(false);
                    }}
                    className="text-red-600 dark:text-red-400 font-semibold hover:underline"
                >
                    Confirm
                </button>
                <span className="text-zinc-300 dark:text-zinc-600">·</span>
                <button
                    onClick={() => setPending(false)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                    Cancel
                </button>
            </span>
        );
    }

    return (
        <button onClick={() => setPending(true)} className={className}>
            {children}
        </button>
    );
}

/* ─── Field wrapper ────────────────────────────────────────────────────── */

export function Field({
    label,
    error,
    hint,
    optional,
    children,
}: {
    label: string;
    error?: string;
    hint?: string;
    optional?: boolean;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                {label}
                {optional && (
                    <span className="normal-case font-normal tracking-normal text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5">
                        optional
                    </span>
                )}
            </label>
            {children}
            {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

/* ─── Input / Textarea / Select shared classes ─────────────────────────── */

export const inputCls =
    'w-full text-sm px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1a1a19] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 focus:border-zinc-400 dark:focus:border-zinc-500 transition';

/* ─── Section header ───────────────────────────────────────────────────── */

export function SectionHeading({
    children,
    sub,
}: {
    children: ReactNode;
    sub?: string;
}) {
    return (
        <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {children}
            </h2>
            {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
        </div>
    );
}

/* ─── Pill toggle (checkbox styled as pill) ────────────────────────────── */

export function PillToggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition select-none ${
            checked
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                : 'bg-white dark:bg-[#1a1a19] text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
        }`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only"
            />
            {label}
        </label>
    );
}
