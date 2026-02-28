"use client";

import { useMemo } from "react";
import { format, differenceInDays, addDays, startOfDay, isBefore, isAfter, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, Clock } from "lucide-react";

export type ProjectNode = {
    id: number;
    name: string;
    status: string;
    startDate: string | null;
    dueDate: string | null;
    clientName: string | null;
};

export function GanttChart({ projects }: { projects: ProjectNode[] }) {
    // Configuración de la escala temporal
    const timeline = useMemo(() => {
        if (!projects || projects.length === 0) return null;

        let minDate = new Date();
        let maxDate = new Date();

        projects.forEach((p) => {
            if (p.startDate) {
                const pStart = new Date(p.startDate);
                if (isBefore(pStart, minDate)) minDate = pStart;
            }
            if (p.dueDate) {
                const pEnd = new Date(p.dueDate);
                if (isAfter(pEnd, maxDate)) maxDate = pEnd;
            }
        });

        // Añadir margen de 5 días antes y 15 días después
        minDate = startOfDay(addDays(minDate, -5));
        maxDate = startOfDay(addDays(maxDate, 15));

        // Agrupar días por mes para el encabezamiento superior
        const months: { label: string; daysCount: number }[] = [];
        let currentMonth = format(minDate, "MMMM yyyy", { locale: es });
        let currentMonthDays = 0;

        const totalDays = differenceInDays(maxDate, minDate);
        const days = Array.from({ length: totalDays + 1 }).map((_, i) => addDays(minDate, i));

        days.forEach((day: Date) => {
            const m = format(day, "MMMM yyyy", { locale: es });
            if (m === currentMonth) {
                currentMonthDays++;
            } else {
                months.push({ label: currentMonth, daysCount: currentMonthDays });
                currentMonth = m;
                currentMonthDays = 1;
            }
        });
        months.push({ label: currentMonth, daysCount: currentMonthDays });

        return { minDate, maxDate, totalDays, days, months };
    }, [projects]);

    if (!projects || projects.length === 0) {
        return (
            <div className="p-10 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">No hay proyectos activos para mostrar en el cronograma.</p>
            </div>
        );
    }

    if (!timeline) return null;

    const today = startOfDay(new Date());

    // Tamaño por día en píxeles
    const DAY_WIDTH = 40;
    const ROW_HEIGHT = 64;

    const getDayOffset = (date: Date) => differenceInDays(date, timeline.minDate) * DAY_WIDTH;

    return (
        <div className="w-full overflow-x-auto relative custom-scrollbar bg-white dark:bg-zinc-950">
            <div className="min-w-max pb-6">
                {/* Cabecera del Timeline (Meses y Días) */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm z-10">
                    <div className="w-64 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-4 font-bold text-sm text-zinc-500 bg-white/95 dark:bg-zinc-950/95 sticky left-0 z-20 flex items-end pb-2">
                        Proyecto / Cliente
                    </div>
                    <div className="flex flex-col relative" style={{ width: timeline.totalDays * DAY_WIDTH }}>

                        {/* Fila de Meses */}
                        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                            {timeline.months.map((m, i) => (
                                <div
                                    key={i}
                                    className="px-3 py-1 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider truncate border-r border-zinc-200 dark:border-zinc-800"
                                    style={{ width: m.daysCount * DAY_WIDTH }}
                                >
                                    {m.label}
                                </div>
                            ))}
                        </div>

                        {/* Fila de Días */}
                        <div className="flex">
                            {timeline.days.map((day: Date, i: number) => {
                                const _isToday = isToday(day);
                                return (
                                    <div
                                        key={i}
                                        className={`flex flex-col items-center justify-center flex-shrink-0 border-r border-zinc-100 dark:border-zinc-800/50 py-1 ${_isToday ? "bg-brand-50/50 dark:bg-brand-900/10" : ""
                                            }`}
                                        style={{ width: DAY_WIDTH }}
                                    >
                                        <span className={`text-[10px] uppercase font-semibold ${_isToday ? "text-brand-600" : "text-zinc-400"}`}>
                                            {format(day, "EEE", { locale: es })}
                                        </span>
                                        <span className={`text-sm ${_isToday ? "font-bold text-brand-600" : "font-medium text-zinc-700 dark:text-zinc-300"}`}>
                                            {format(day, "d")}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Línea de Hoy */}
                        <div
                            className="absolute top-0 bottom-0 w-px bg-brand-500/50 z-0 pointer-events-none"
                            style={{ left: getDayOffset(today) + (DAY_WIDTH / 2) }}
                        >
                            <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-brand-500" />
                        </div>
                    </div>
                </div>

                {/* Filas de Proyectos */}
                <div className="relative">
                    {projects.map((project, idx) => {
                        const hasStart = !!project.startDate;
                        const hasDue = !!project.dueDate;

                        const pStart = startOfDay(hasStart ? new Date(project.startDate!) : today);
                        const pDue = startOfDay(hasDue ? new Date(project.dueDate!) : addDays(pStart, 1));

                        const isLate = hasDue && isBefore(pDue, today);
                        const isDueSoon = hasDue && !isLate && differenceInDays(pDue, today) <= 3;

                        const leftOffset = Math.max(0, getDayOffset(pStart));
                        // Asegurar un ancho mínimo de 1 día
                        let width = Math.max(DAY_WIDTH, differenceInDays(pDue, pStart) * DAY_WIDTH);

                        // Colores por estado
                        const barBg = project.status === 'in_progress'
                            ? 'bg-brand-500 dark:bg-brand-600'
                            : 'bg-zinc-300 dark:bg-zinc-700';

                        const barBorder = isLate
                            ? 'ring-2 ring-red-500 ring-offset-1 dark:ring-offset-zinc-900'
                            : isDueSoon
                                ? 'ring-2 ring-orange-400 ring-offset-1 dark:ring-offset-zinc-900'
                                : '';

                        return (
                            <div key={project.id} className="flex border-b border-zinc-100 dark:border-zinc-800/50 group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                                {/* Info del Proyecto (Fija a la izquierda) */}
                                <div className="w-64 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-950 sticky left-0 z-20 flex flex-col justify-center group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900/40 transition-colors">
                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate" title={project.name}>
                                        {project.name}
                                    </p>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                                        {project.clientName || 'Cliente interno'}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${project.status === 'in_progress' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                            {project.status === 'in_progress' ? 'En Producción' : 'Planning'}
                                        </span>
                                        {isLate && (
                                            <div title="Atrasado">
                                                <AlertCircle size={12} className="text-red-500" />
                                            </div>
                                        )}
                                        {isDueSoon && (
                                            <div title="Vence pronto">
                                                <Clock size={12} className="text-orange-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Timeline del Proyecto */}
                                <div className="relative flex-grow pointer-events-none" style={{ height: ROW_HEIGHT, width: timeline.totalDays * DAY_WIDTH }}>
                                    {/* Rejilla de Días de Fondo */}
                                    <div className="absolute inset-0 flex">
                                        {timeline.days.map((_: Date, i: number) => (
                                            <div key={i} className="border-r border-zinc-100 dark:border-zinc-800/30 h-full flex-shrink-0" style={{ width: DAY_WIDTH }} />
                                        ))}
                                    </div>

                                    {/* Barra Gantt */}
                                    <div
                                        className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-md shadow-sm opacity-90 transition-all ${barBg} ${barBorder} flex items-center justify-end px-2`}
                                        style={{ left: leftOffset, width: width }}
                                    >
                                        {/* Alertas rojas/naranjas como punto relativo */}
                                        {isLate && (
                                            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900 animate-pulse flex-shrink-0 -mr-3" title="Proyecto atrasado" />
                                        )}
                                        {isDueSoon && (
                                            <div className="w-3 h-3 rounded-full bg-orange-400 border-2 border-white dark:border-zinc-900 animate-pulse flex-shrink-0 -mr-3" title="Próximo a vencer" />
                                        )}
                                    </div>

                                    {/* Tooltip de fechas hover al lado de la barra */}
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 text-[11px] font-medium text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 flex items-center gap-1 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur rounded py-1"
                                        style={{ left: leftOffset + width + (isLate || isDueSoon ? 12 : 4) }}
                                    >
                                        {!hasStart ? "⚠️ Sin fecha inicio" : ""}
                                        {!hasDue ? "⚠️ Sin de entrega" : ""}
                                        {(hasStart || hasDue) ? `${format(pStart, "d/MM", { locale: es })} - ${format(pDue, "d/MM", { locale: es })}` : ""}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
