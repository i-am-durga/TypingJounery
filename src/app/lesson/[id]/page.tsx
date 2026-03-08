"use client";

import { useState, useEffect } from "react";
import { TypingEngine } from "@/components/typing/TypingEngine";
import { Timer } from "@/components/typing/Timer";
import { ResultCard } from "@/components/typing/ResultCard";
import { Progress } from "@/components/ui/progress";
import { Zap, Target as TargetIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { generateWords } from "@/lib/words";
import { CompletionData } from "@/types";

export default function TypingEnginePage({ params }: { params: { id: string } }) {
    const initialCount = params.id === 'practice-words' ? 50 : 150;
    const modeStr = params.id.replace('practice-', '') as 'timed' | 'words' | 'quote' | 'zen' | 'ghost';

    const [text, setText] = useState("");
    const [lessonTitle, setLessonTitle] = useState("Loading...");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mistakeCount, setMistakeCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [duration, setDuration] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [completionData, setCompletionData] = useState<CompletionData | null>(null);

    useEffect(() => {
        setText(generateWords({ mode: modeStr, count: initialCount }));
        setLessonTitle(`Practice: ${modeStr.charAt(0).toUpperCase() + modeStr.slice(1)} Mode`);
    }, [params.id, modeStr, initialCount]);

    const handleFinish = async (stats: { mistakes: Record<number, boolean>; mistakeKeys: string[]; duration: number }) => {
        setIsFinished(true);
        const finalWpm = Math.round(((text.length / 5) / stats.duration) * 60);
        const finalAccuracy = Math.round(((text.length - Object.keys(stats.mistakes).length) / text.length) * 100);

        setWpm(finalWpm);
        setAccuracy(finalAccuracy);

        try {
            const res = await fetch(`/api/lessons/${params.id}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wpm: finalWpm,
                    accuracy: finalAccuracy,
                    duration: stats.duration,
                    language: "english",
                    mistakeKeys: stats.mistakeKeys
                })
            });
            if (res.ok) setCompletionData(await res.json());
        } catch (e) {
            console.error("Failed to save session", e);
        }
    };

    const handleRestart = () => {
        setText(generateWords({ mode: modeStr, count: initialCount }));
        setCurrentIndex(0);
        setMistakeCount(0);
        setIsFinished(false);
        setStartTime(null);
        setDuration(0);
        setCompletionData(null);
    };

    const liveWpm = startTime && duration > 0 ? Math.round(((currentIndex / 5) / duration) * 60) : 0;
    const progressPercent = text.length > 0 ? (currentIndex / text.length) * 100 : 0;

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-navy">
            <div className="border-b border-white/10 bg-navy-dark p-4 sticky top-16 z-40 shadow-md">
                <div className="container mx-auto max-w-5xl flex items-center justify-between">
                    <div className="font-heading font-bold text-lg text-white">{lessonTitle}</div>
                    <div className="flex gap-6 md:gap-12 text-sm md:text-base">
                        <Timer startTime={startTime} isFinished={isFinished} onTick={setDuration} />
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-secondary" />
                            <span className="font-mono font-bold text-secondary">{liveWpm} WPM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TargetIcon className="w-4 h-4 text-green-400" />
                            <span className="font-mono font-bold text-white">
                                {currentIndex > 0 ? Math.round(((currentIndex - mistakeCount) / currentIndex) * 100) : 100}%
                            </span>
                        </div>
                    </div>
                </div>
                <Progress value={progressPercent} className="h-1 mt-4 rounded-none bg-white/5" />
            </div>

            <div className="flex-1 container mx-auto max-w-5xl p-4 flex flex-col justify-center gap-12 pt-12 pb-24 relative">
                {!isFinished && text && (
                    <TypingEngine
                        text={text}
                        onProgress={setCurrentIndex}
                        onKeyTyped={(key, correct) => {
                            if (!startTime) setStartTime(Date.now());
                            if (!correct) setMistakeCount(prev => prev + 1);
                        }}
                        onFinish={handleFinish}
                    />
                )}
            </div>

            <AnimatePresence>
                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 backdrop-blur-md p-4"
                    >
                        <ResultCard
                            wpm={wpm}
                            accuracy={accuracy}
                            completionData={completionData}
                            onRestart={handleRestart}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
