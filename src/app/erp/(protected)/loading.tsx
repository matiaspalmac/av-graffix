export default function ErpLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                </div>
                <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                            <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                            <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="h-64 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
                    <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="h-20 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="h-20 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                </div>

                <div className="h-64 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
                    <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
