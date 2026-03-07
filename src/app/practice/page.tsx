"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Timer, Quote as QuoteIcon, Type, Target, Ghost } from "lucide-react";
import Link from "next/link";

const MODES = [
    {
        id: "timed",
        title: "Timed Mode",
        description: "Race against the clock in 15s, 30s, or 60s bursts.",
        icon: <Timer className="w-8 h-8 text-primary" />,
        color: "bg-primary/10 border-primary/30 hover:border-primary",
        href: "/lesson/practice-timed"
    },
    {
        id: "words",
        title: "Word Count",
        description: "Type 10, 25, 50, or 100 words as fast as possible.",
        icon: <Type className="w-8 h-8 text-secondary" />,
        color: "bg-secondary/10 border-secondary/30 hover:border-secondary",
        href: "/lesson/practice-words"
    },
    {
        id: "quote",
        title: "Quote Mode",
        description: "Type famous quotes from literature and history.",
        icon: <QuoteIcon className="w-8 h-8 text-blue-400" />,
        color: "bg-blue-400/10 border-blue-400/30 hover:border-blue-400",
        href: "/lesson/practice-quote"
    },
    {
        id: "zen",
        title: "Zen Mode",
        description: "No timer, no pressure. Just pure typing practice.",
        icon: <Target className="w-8 h-8 text-green-400" />,
        color: "bg-green-400/10 border-green-400/30 hover:border-green-400",
        href: "/lesson/practice-zen"
    },
    {
        id: "ghost",
        title: "Ghost Racer",
        description: "Race against your previous best WPM ghost cursor.",
        icon: <Ghost className="w-8 h-8 text-purple-400" />,
        color: "bg-purple-400/10 border-purple-400/30 hover:border-purple-400",
        href: "/lesson/practice-ghost"
    }
];

export default function PracticeModesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
                    Practice <span className="text-primary neon-text-primary">Modes</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Mix up your routine with specialized training modes designed to target different aspects of your typing skill.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MODES.map((mode, idx) => (
                    <motion.div
                        key={mode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                        <Link href={mode.href} className="block h-full">
                            <div className={`h-full flex flex-col p-8 rounded-2xl border transition-all duration-300 glass-panel group ${mode.color}`}>
                                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-navy-dark/50 border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    {mode.icon}
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-white mb-3">{mode.title}</h3>
                                <p className="text-gray-400 flex-1 leading-relaxed">
                                    {mode.description}
                                </p>
                                <div className="mt-8">
                                    <span className="text-sm font-bold uppercase tracking-wider text-white opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                        Start Practice <span className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">→</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {/* Custom Mode Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: MODES.length * 0.1 }}
                    className="md:col-span-2 lg:col-span-1"
                >
                    <div className="h-full flex flex-col p-8 rounded-2xl border border-white/10 bg-navy-light/30 transition-all duration-300 hover:bg-navy-light/50 outline-dashed outline-2 outline-white/10 outline-offset-[-10px]">
                        <h3 className="text-2xl font-bold font-heading text-white mb-3 mt-4">Custom Text</h3>
                        <p className="text-gray-400 flex-1 leading-relaxed mb-6">
                            Paste your own text, code, or article to practice exactly what you need.
                        </p>
                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold h-12" asChild>
                            <Link href="/lesson/practice-custom">Upload Text</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
