"use client";

import type { PlanningStep as PlanningStepType } from "@/lib/ai/tools/add-planning-step";
import { motion } from "framer-motion";

interface PlanningStepProps {
    step: PlanningStepType[];
}

export const PlanningStep = ({ step }: PlanningStepProps) => {

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-50 p-4 rounded-lg flex flex-col w-full justify-between"
        >
            <p className="text-[10px] uppercase text-zinc-500 dark:text-zinc-400">
                reasoning step
            </p>
            <h3 className="font-bold">{step[0].title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{step[0].content}</p>
        </motion.div>
    );
};
