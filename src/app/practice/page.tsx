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
                            <div className={`h-full flex flex-col p-8 rounded-2xl border transition-all duration-300 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] group hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${mode.color.includes('primary') ? 'bg-navy/80 hover:bg-navy border-primary/20 hover:border-primary/60' : mode.color.includes('secondary') ? 'bg-navy/80 hover:bg-navy border-secondary/20 hover:border-secondary/60' : mode.color.includes('blue') ? 'bg-navy/80 hover:bg-navy border-blue-400/20 hover:border-blue-400/60' : mode.color.includes('green') ? 'bg-navy/80 hover:bg-navy border-green-400/20 hover:border-green-400/60' : 'bg-navy/80 hover:bg-navy border-purple-400/20 hover:border-purple-400/60'}`}>
                                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-navy-dark border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-inner group-hover:shadow-none">
                                    {mode.icon}
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-white mb-3">{mode.title}</h3>
                                <p className="text-gray-400 flex-1 leading-relaxed">
                                    {mode.description}
                                </p>
                                <div className="mt-8">
                                    <span className={`text-sm font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-all flex items-center gap-2 ${mode.color.includes('primary') ? 'text-primary' : mode.color.includes('secondary') ? 'text-secondary' : mode.color.includes('blue') ? 'text-blue-400' : mode.color.includes('green') ? 'text-green-400' : 'text-purple-400'}`}>
                                        Start Practice <span className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">→</span>
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
                    <div className="h-full flex flex-col p-8 rounded-2xl border border-white/10 bg-navy/60 backdrop-blur-md transition-all duration-300 hover:bg-navy/80 shadow-[0_0_30px_rgba(0,0,0,0.5)] outline-dashed outline-2 outline-white/10 outline-offset-[-10px] hover:outline-white/30">
                        <h3 className="text-2xl font-bold font-heading text-white mb-3 mt-4">Custom Text</h3>
                        <p className="text-gray-400 flex-1 leading-relaxed mb-6">
                            Paste your own text, code, or article to practice exactly what you need.
                        </p>
                        <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold h-12 rounded-xl transition-all" asChild>
                            <Link href="/lesson/practice-custom">Upload Text</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
