"use client";

import { motion } from "framer-motion";
import { Trophy, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CompletionData } from "@/types";

interface ResultCardProps {
    wpm: number;
    accuracy: number;
    completionData: CompletionData | null;
    onRestart: () => void;
}

export function ResultCard({ wpm, accuracy, completionData, onRestart }: ResultCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-light border border-primary/20 shadow-[0_0_50px_rgba(0,229,255,0.1)] rounded-3xl p-8 max-w-md w-full text-center"
        >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,229,255,0.5)]">
                <Trophy className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl font-heading font-black text-white mb-2">Lesson Complete!</h2>
            {completionData && (
                <p className="text-secondary font-bold mb-8">+{completionData.xpEarned} XP Earned</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-navy-dark p-4 rounded-xl border border-white/5">
                    <div className="text-gray-400 text-sm mb-1">Speed</div>
                    <div className="text-3xl font-mono font-bold text-primary">{wpm} <span className="text-sm">WPM</span></div>
                </div>
                <div className="bg-navy-dark p-4 rounded-xl border border-white/5">
                    <div className="text-gray-400 text-sm mb-1">Accuracy</div>
                    <div className="text-3xl font-mono font-bold text-white">{accuracy}%</div>
                </div>
            </div>

            {completionData?.newBadges && completionData.newBadges.length > 0 && (
                <div className="mb-8">
                    <p className="text-sm text-gray-400 mb-2">New Badges Unlocked!</p>
                    <div className="flex justify-center gap-2">
                        {completionData.newBadges.map((badge, i) => (
                            <div key={i} className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-secondary border border-secondary/30">
                                🏆 {badge.replace('-', ' ').toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <Button className="w-full bg-primary hover:bg-primary-hover text-navy font-bold h-12" asChild>
                    <Link href="/path" className="flex items-center justify-center">
                        Next Lesson <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 h-12" onClick={onRestart}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Button>
            </div>
        </motion.div>
    );
}
