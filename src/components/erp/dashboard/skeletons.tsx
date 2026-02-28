export function KpiSkeleton() {
    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 w-full">
            <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            </div>
            <div className="mt-4 h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="mt-2 h-3 w-40 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
    );
}

export function ExecutiveKpisSkeleton() {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiSkeleton />
                <KpiSkeleton />
                <KpiSkeleton />
                <KpiSkeleton />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                <KpiSkeleton />
                <KpiSkeleton />
                <KpiSkeleton />
                <KpiSkeleton />
            </div>
        </>
    );
}

export function WidgetSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 ${className}`}>
            <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-6" />
            <div className="space-y-3">
                <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}
