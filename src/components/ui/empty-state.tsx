import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    children?: ReactNode;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    children
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6 mx-auto">
                <Icon className="w-8 h-8 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
            </div>

            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {title}
            </h3>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6 leading-relaxed">
                {description}
            </p>

            {action && (
                action.href ? (
                    <Link
                        href={action.href}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-brand-600 hover:bg-brand-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                    >
                        {action.label}
                    </Link>
                ) : action.onClick ? (
                    <button
                        onClick={action.onClick}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-brand-600 hover:bg-brand-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                    >
                        {action.label}
                    </button>
                ) : null
            )}

            {children && (
                <div className="mt-6 w-full max-w-md">
                    {children}
                </div>
            )}
        </div>
    );
}
