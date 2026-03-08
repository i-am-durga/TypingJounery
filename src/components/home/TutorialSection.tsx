"use client";

import { motion } from "framer-motion";

export function TutorialSection() {
    return (
        <section className="py-24 bg-muted/10 relative overflow-hidden flex flex-col items-center">
            <div className="container px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
                        Perfect Form. <span className="text-secondary neon-text-secondary">Perfect Speed.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
                        Follow our visual guides to learn correct finger placement. Break bad habits and build muscle memory the right way.
                    </p>
                </motion.div>

                {/* CSS-based Hand & Keyboard Visualization since Lottie requires files we don't have yet */}
                <motion.div
                    className="relative max-w-4xl mx-auto bg-card/50 p-8 rounded-3xl border border-border shadow-2xl glass-panel"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Abstract Hand Representation */}
                    <div className="flex justify-between items-end h-32 mb-8 px-12 opacity-80">
                        {/* Left Hand Fingers - abstracted as glowing nodes */}
                        <div className="flex gap-4 items-end">
                            <div className="w-6 h-12 bg-red-400/80 rounded-t-full relative shadow-[0_0_15px_rgba(248,113,113,0.5)]"></div> {/* Pinky -> A */}
                            <div className="w-6 h-16 bg-yellow-400/80 rounded-t-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>     {/* Ring -> S */}
                            <div className="w-6 h-20 bg-green-400/80 rounded-t-full shadow-[0_0_15px_rgba(74,222,128,0.5)]"></div>    {/* Middle -> D */}
                            <div className="w-6 h-16 bg-blue-400/80 rounded-t-full shadow-[0_0_15px_rgba(96,165,250,0.5)]"></div>     {/* Index -> F */}
                            <div className="w-8 h-8 rounded-full bg-purple-400/80 ml-4 self-center shadow-[0_0_15px_rgba(192,132,252,0.5)]"></div> {/* Thumb -> Space */}
                        </div>

                        {/* Right Hand Fingers */}
                        <div className="flex gap-4 items-end flex-row-reverse">
                            <div className="w-6 h-12 bg-red-400/80 rounded-t-full shadow-[0_0_15px_rgba(248,113,113,0.5)]"></div> {/* Pinky -> ; */}
                            <div className="w-6 h-16 bg-yellow-400/80 rounded-t-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>     {/* Ring -> L */}
                            <div className="w-6 h-20 bg-green-400/80 rounded-t-full shadow-[0_0_15px_rgba(74,222,128,0.5)]"></div>    {/* Middle -> K */}
                            <div className="w-6 h-16 bg-blue-400/80 rounded-t-full shadow-[0_0_15px_rgba(96,165,250,0.5)]"></div>     {/* Index -> J */}
                            <div className="w-8 h-8 rounded-full bg-purple-400/80 mr-4 self-center shadow-[0_0_15px_rgba(192,132,252,0.5)]"></div> {/* Thumb -> Space */}
                        </div>
                    </div>

                    {/* Simple Keyboard Row Simulation */}
                    <div className="flex justify-center gap-2 mt-4 font-mono font-bold text-lg">
                        <div className="w-14 h-14 bg-background border border-red-400/30 text-red-100 flex items-center justify-center rounded-lg animate-pulse">A</div>
                        <div className="w-14 h-14 bg-background border border-yellow-400/30 text-yellow-100 flex items-center justify-center rounded-lg">S</div>
                        <div className="w-14 h-14 bg-background border border-green-400/30 text-green-100 flex items-center justify-center rounded-lg">D</div>
                        <div className="w-14 h-14 bg-background border-b-4 border-blue-400 text-blue-100 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(96,165,250,0.4)]">F</div>

                        <div className="w-8"></div>

                        <div className="w-14 h-14 bg-background border-b-4 border-blue-400 text-blue-100 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(96,165,250,0.4)]">J</div>
                        <div className="w-14 h-14 bg-background border border-green-400/30 text-green-100 flex items-center justify-center rounded-lg">K</div>
                        <div className="w-14 h-14 bg-background border border-yellow-400/30 text-yellow-100 flex items-center justify-center rounded-lg">L</div>
                        <div className="w-14 h-14 bg-background border border-red-400/30 text-red-100 flex items-center justify-center rounded-lg">;</div>
                    </div>

                    <div className="flex justify-center mt-2">
                        <div className="w-64 h-14 bg-background border border-purple-400/30 flex items-center justify-center rounded-lg">
                            SPACE
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
