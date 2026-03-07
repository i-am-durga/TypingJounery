"use client";

import { useRef, useState, useEffect } from "react";
import { VirtualKeyboard } from "@/components/typing/Keyboard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target as TargetIcon, RefreshCw, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { generateWords } from "@/lib/words";

interface CompletionData {
    xpEarned: number;
    newBadges: string[];
}

export default function TypingEnginePage({ params }: { params: { id: string } }) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial word count based on lesson type
    const initialCount = params.id === 'practice-words' ? 50 : 150;
    const modeStr = params.id.replace('practice-', '') as 'timed' | 'words' | 'quote' | 'zen' | 'ghost';

    // Lesson state
    const [text, setText] = useState("");
    const [lessonTitle, setLessonTitle] = useState("Loading...");

    // Formatting based on params
    useEffect(() => {
        setText(generateWords({ mode: modeStr, count: initialCount }));
        setLessonTitle(`Practice: ${modeStr.charAt(0).toUpperCase() + modeStr.slice(1)} Mode`);
    }, [params.id, modeStr, initialCount]);

    // Typing state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mistakes, setMistakes] = useState<Record<number, boolean>>({});
    const [mistakeKeys, setMistakeKeys] = useState<string[]>([]);
    const [lastKeyPressed, setLastKeyPressed] = useState("");
    const [isErrorState, setIsErrorState] = useState(false);

    // Timer & Stats
    const [startTime, setStartTime] = useState<number | null>(null);
    const [duration, setDuration] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    // Results
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [completionData, setCompletionData] = useState<CompletionData | null>(null);

    // Focus input automatically
    useEffect(() => {
        inputRef.current?.focus();
        const handleGlobalClick = () => inputRef.current?.focus();
        window.addEventListener("click", handleGlobalClick);
        return () => window.removeEventListener("click", handleGlobalClick);
    }, []);

    // Update timer
    useEffect(() => {
        if (startTime && !isFinished) {
            const interval = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            setTimerInterval(interval);
            return () => clearInterval(interval);
        }
    }, [startTime, isFinished]);

    // Handle typing input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isFinished) return;

        // Ignore meta keys
        if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
            // Allow Backspace
            if (e.key === "Backspace" && currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
                setIsErrorState(false);
            }
            return;
        }

        e.preventDefault();
        setLastKeyPressed(e.key);

        if (!startTime) {
            setStartTime(Date.now());
        }

        const expectedChar = text[currentIndex];

        if (e.key === expectedChar) {
            setCurrentIndex(prev => prev + 1);
            setIsErrorState(false);

            // Check if finished
            if (currentIndex + 1 === text.length) {
                finishLesson();
            }
        } else {
            setMistakes(prev => ({ ...prev, [currentIndex]: true }));
            setMistakeKeys(prev => [...prev, expectedChar]);
            setIsErrorState(true);

            // Screen shake or physical feedback could go here
        }
    };

    const finishLesson = async () => {
        setIsFinished(true);
        if (timerInterval) clearInterval(timerInterval);

        const finalDuration = Math.max(1, Math.floor((Date.now() - (startTime || Date.now())) / 1000));
        const wordsTyped = text.length / 5;
        const finalWpm = Math.round((wordsTyped / finalDuration) * 60);

        const totalMistakes = Object.keys(mistakes).length;
        const finalAccuracy = Math.round(((text.length - totalMistakes) / text.length) * 100);

        setWpm(finalWpm);
        setAccuracy(finalAccuracy);

        // Save session
        try {
            const res = await fetch(`/api/lessons/${params.id}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wpm: finalWpm,
                    accuracy: finalAccuracy,
                    duration: finalDuration,
                    language: "english",
                    mistakeKeys
                })
            });
            if (res.ok) {
                setCompletionData(await res.json());
            }
        } catch {
            console.error("Failed to save session");
        }
    };

    const restartLesson = () => {
        setText(generateWords({ mode: modeStr, count: initialCount }));
        setCurrentIndex(0);
        setMistakes({});
        setMistakeKeys([]);
        setStartTime(null);
        setDuration(0);
        setIsFinished(false);
        setWpm(0);
        setAccuracy(100);
        setCompletionData(null);
        inputRef.current?.focus();
    };

    // Render text with highlighting
    const renderText = () => {
        return text.split('').map((char, index) => {
            let className = "text-gray-500"; // Upcoming

            if (index < currentIndex) {
                className = mistakes[index] ? "text-red-400 underline decoration-red-500/50" : "text-white neon-text-primary";
            } else if (index === currentIndex) {
                className = `bg-primary/20 text-white border-b-2 ${isErrorState ? 'border-red-500 bg-red-500/20' : 'border-primary animate-pulse'}`;
            }

            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    // Calculate live WPM
    const liveWpm = startTime && duration > 0 ? Math.round(((currentIndex / 5) / duration) * 60) : 0;
    const progressPercent = (currentIndex / text.length) * 100;

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-navy">
            {/* Top Bar */}
            <div className="border-b border-white/10 bg-navy-dark p-4 sticky top-16 z-40 shadow-md">
                <div className="container mx-auto max-w-5xl flex items-center justify-between">
                    <div className="font-heading font-bold text-lg text-white">
                        {lessonTitle}
                    </div>

                    <div className="flex gap-6 md:gap-12 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-mono font-bold text-white">{duration}s</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-secondary" />
                            <span className="font-mono font-bold text-secondary">{liveWpm} WPM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TargetIcon className="w-4 h-4 text-green-400" />
                            <span className="font-mono font-bold text-white">
                                {currentIndex > 0 ? Math.round(((currentIndex - Object.keys(mistakes).length) / currentIndex) * 100) : 100}%
                            </span>
                        </div>
                    </div>
                </div>
                <Progress value={progressPercent} className="h-1 mt-4 rounded-none bg-white/5" />
            </div>

            <div className="flex-1 container mx-auto max-w-5xl p-4 flex flex-col justify-center gap-12 pt-12 pb-24 relative">

                {/* Hidden Input */}
                <input
                    ref={inputRef}
                    type="text"
                    className="absolute opacity-0 w-0 h-0"
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />

                {/* Text Display */}
                <div
                    className="font-mono text-3xl md:text-5xl leading-relaxed md:leading-loose tracking-wide break-words select-none text-center px-4"
                    onClick={() => inputRef.current?.focus()}
                >
                    {renderText()}
                </div>

                {/* Keyboard */}
                {!isFinished && (
                    <div className="mt-auto">
                        <VirtualKeyboard
                            currentExpectedKey={text[currentIndex] || ""}
                            lastPressedKey={lastKeyPressed}
                            isError={isErrorState}
                        />
                    </div>
                )}

            </div>

            {/* Completion Modal */}
            <AnimatePresence>
                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
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
                                        {completionData.newBadges.map((badge: string, i: number) => (
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
                                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 h-12" onClick={restartLesson}>
                                    <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
