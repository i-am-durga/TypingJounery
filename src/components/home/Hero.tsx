"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-background z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]" />
            </div>

            {/* Floating Letters Background */}
            {mounted && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
                    {["T", "Y", "P", "I", "N", "G", "J", "O", "U", "N", "E", "R", "Y", "D", "O", "J", "O"].map((char, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-primary/40 font-mono text-4xl font-bold"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: window.innerHeight + 100
                            }}
                            animate={{
                                y: -100,
                                rotate: Math.random() * 360,
                            }}
                            transition={{
                                duration: 10 + Math.random() * 20,
                                repeat: Infinity,
                                ease: "linear",
                                delay: Math.random() * 10,
                            }}
                        >
                            {char}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Hero Content */}
            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    Next Level Typing Experience
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight text-foreground mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Master Typing. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Any Language.</span> <br />
                    <span className="text-secondary">Any Level.</span>
                </motion.h1>

                <motion.p
                    className="mt-6 max-w-[600px] text-muted-foreground md:text-xl font-body mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Boost your Words Per Minute with our futuristic, gamified typing dojo. Track your progress, earn badges, and dominate the global leaderboards.
                </motion.p>

                {/* Language Selector Preview */}
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-4 mb-10 bg-card/50 p-4 rounded-2xl border border-border backdrop-blur"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 px-4 py-2 bg-background/5 rounded-lg border border-primary/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                        <span className="text-xl">🇺🇸</span>
                        <span className="font-medium text-foreground">English</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors text-muted-foreground">
                        <span className="text-xl">🇮🇳</span>
                        <span>Hindi</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors text-muted-foreground">
                        <span className="text-xl">🇳🇵</span>
                        <span>Nepali</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-14 text-lg shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all hover:scale-105" asChild>
                        <Link href="/register">Start Learning Free</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
