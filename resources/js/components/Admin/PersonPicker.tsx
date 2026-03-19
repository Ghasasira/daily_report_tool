import { useState, useMemo } from 'react';
import { Check, Search, X } from 'lucide-react';

export interface Person {
    id: number;
    name: string;
    email: string;
    /** Optional label shown when person already belongs to a team */
    team_name?: string | null;
}

interface Props {
    people: Person[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    placeholder?: string;
    maxHeight?: string;
    /** Show a "has team" badge on people already assigned elsewhere */
    showTeamHint?: boolean;
}

export default function PersonPicker({
    people,
    selectedIds,
    onToggle,
    placeholder = 'Search...',
    maxHeight = 'max-h-56',
    showTeamHint = false,
}: Props) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return people;
        return people.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.email.toLowerCase().includes(q)
        );
    }, [people, query]);

    const selectedPeople = people.filter((p) => selectedIds.includes(p.id));

    return (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-[#1a1a19]">

            {/* Search bar */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <Search className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Scrollable list */}
            <div className={`${maxHeight} overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800/60`}>
                {filtered.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-zinc-400 italic text-center">
                        No matches found.
                    </p>
                ) : (
                    filtered.map((person) => {
                        const selected = selectedIds.includes(person.id);
                        return (
                            <button
                                key={person.id}
                                type="button"
                                onClick={() => onToggle(person.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                    selected
                                        ? 'bg-zinc-50 dark:bg-zinc-800/60'
                                        : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30'
                                }`}
                            >
                                {/* Custom checkbox */}
                                <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-[1.5px] transition-all ${
                                    selected
                                        ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100'
                                        : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-[#1a1a19]'
                                }`}>
                                    {selected && (
                                        <Check
                                            className="w-2.5 h-2.5 text-white dark:text-zinc-900"
                                            strokeWidth={2.5}
                                        />
                                    )}
                                </span>

                                {/* Avatar initial */}
                                <span className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                                    {person.name.charAt(0).toUpperCase()}
                                </span>

                                {/* Name + email */}
                                <span className="flex-1 min-w-0">
                                    <span className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                        {person.name}
                                    </span>
                                    <span className="block text-xs text-zinc-400 truncate">
                                        {person.email}
                                    </span>
                                </span>

                                {/* Team hint */}
                                {showTeamHint && person.team_name && !selected && (
                                    <span className="text-[10px] text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-full px-2 py-0.5 flex-shrink-0 whitespace-nowrap">
                                        {person.team_name}
                                    </span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Selected count footer */}
            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                    {selectedIds.length === 0
                        ? 'None selected'
                        : `${selectedIds.length} selected`}
                </span>
                {/* Chip list of selected names */}
                {selectedPeople.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-end">
                        {selectedPeople.slice(0, 3).map((p) => (
                            <span
                                key={p.id}
                                className="text-[10px] font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full px-2 py-0.5"
                            >
                                {p.name.split(' ')[0]}
                            </span>
                        ))}
                        {selectedPeople.length > 3 && (
                            <span className="text-[10px] text-zinc-400">
                                +{selectedPeople.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
