"use client";

import { motion } from "framer-motion";

type WelcomeProps = {
    name: string;
};

export function Welcome({ name }: WelcomeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:items-end"
        >
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Bienvenido de vuelta, <span className="font-bold text-zinc-900 dark:text-zinc-100">{name}</span>.
            </p>
        </motion.div>
    );
}
