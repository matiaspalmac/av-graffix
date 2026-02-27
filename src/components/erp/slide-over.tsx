"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function SlideOver({ isOpen, onClose, title, description, children }: SlideOverProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
        >
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />
            <div className="absolute inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
                <div
                    className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex h-full flex-col bg-white dark:bg-zinc-950 shadow-2xl">
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm">
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                                    {title}
                                </h2>
                                {description && (
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-zinc-400 hover:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <span className="sr-only">Cerrar panel</span>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar">
                            {children}
                        </div>

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
