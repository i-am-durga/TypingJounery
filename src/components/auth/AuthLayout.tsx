"use client";

import { motion } from "framer-motion";
import { Keyboard } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
    const [typedText, setTypedText] = useState("");
    const fullText = "const masterTyping = async () => {\n  await practice(daily);\n  return speed + accuracy;\n};";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.substring(0, i));
            i++;
            if (i > fullText.length) {
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background items-center justify-center p-4">
            <div className="w-full max-w-6xl flex shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden glass-panel border border-border h-[800px] max-h-[90vh] bg-card/40 backdrop-blur-2xl">

                {/* Left Side - Animated Demo */}
                <div className="hidden md:flex md:w-1/2 bg-muted/30 p-14 flex-col justify-between relative overflow-hidden border-r border-border backdrop-blur-md">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.1)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

                    <Link href="/" className="flex items-center gap-2 group relative z-10 w-fit">
                        <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                            <Keyboard className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-wide neon-text-primary">
                            TypingJounery
                        </span>
                    </Link>

                    <div className="relative z-10 my-auto">
                        <h2 className="text-4xl font-heading font-black text-foreground mb-6">
                            Unlock Your <br />
                            <span className="text-primary neon-text-primary">True Potential</span>
                        </h2>
                        <div className="bg-card p-6 rounded-xl font-mono text-sm text-green-400 border border-border shadow-inner">
                            <pre className="whitespace-pre-wrap word-break">
                                {typedText}<span className="animate-pulse bg-primary w-2 h-4 inline-block ml-1 align-middle"></span>
                            </pre>
                        </div>
                    </div>

                    <div className="relative z-10 text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} TypingJounery
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-card/60 relative backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md mx-auto"
                    >
                        <div className="mb-10 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
                            <p className="text-muted-foreground">{subtitle}</p>
                        </div>
                        {children}
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
