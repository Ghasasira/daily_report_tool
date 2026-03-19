import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface TaskListInputProps {
    label: string;
    description?: string;
    value: string[];
    onChange: (tasks: string[]) => void;
    placeholder?: string;
    error?: string;
    accentColor?: string;
}

export default function TaskListInput({
    label,
    description,
    value,
    onChange,
    placeholder = 'Add an item...',
    error,
    accentColor = '#18181b',
}: TaskListInputProps) {
    const [inputValue, setInputValue] = useState('');

    const addTask = () => {
        const trimmed = inputValue.trim();

        if (!trimmed){
            return;
        }

        onChange([...value, trimmed]);
        setInputValue('');
    };

    const removeTask = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    };

    return (
        <div className="space-y-2">
            <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {label}
                </label>
                {description && (
                    <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
                )}
            </div>

            {/* Existing items */}
            {value.length > 0 && (
                <ul className="space-y-1.5">
                    {value.map((task, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 group"
                        >
                            <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: accentColor }}
                            />
                            <span className="flex-1 leading-relaxed">{task}</span>
                            <button
                                title='remove task'
                                type="button"
                                onClick={() => removeTask(index)}
                                className="text-zinc-400 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Add input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 text-sm px-3 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition"
                />
                <button
                    type="button"
                    onClick={addTask}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}
