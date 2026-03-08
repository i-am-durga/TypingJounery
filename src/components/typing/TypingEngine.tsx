"use client";

import { useRef, useState, useEffect } from "react";
import { VirtualKeyboard } from "./Keyboard";

interface TypingEngineProps {
    text: string;
    onFinish: (stats: { mistakes: Record<number, boolean>; mistakeKeys: string[]; duration: number }) => void;
    onProgress?: (index: number) => void;
    onKeyTyped?: (key: string, isCorrect: boolean) => void;
}

export function TypingEngine({ text, onFinish, onProgress, onKeyTyped }: TypingEngineProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mistakes, setMistakes] = useState<Record<number, boolean>>({});
    const [mistakeKeys, setMistakeKeys] = useState<string[]>([]);
    const [lastKeyPressed, setLastKeyPressed] = useState("");
    const [isErrorState, setIsErrorState] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const handleGlobalClick = () => inputRef.current?.focus();
        window.addEventListener("click", handleGlobalClick);
        return () => window.removeEventListener("click", handleGlobalClick);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Ignore meta keys
        if (e.ctrlKey || e.altKey || e.metaKey || e.key.length > 1) {
            if (e.key === "Backspace" && currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
                if (onProgress) onProgress(currentIndex - 1);
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
        const isCorrect = e.key === expectedChar;

        if (onKeyTyped) onKeyTyped(e.key, isCorrect);

        if (isCorrect) {
            setCurrentIndex(prev => prev + 1);
            if (onProgress) onProgress(currentIndex + 1);
            setIsErrorState(false);

            if (currentIndex + 1 === text.length) {
                const duration = Math.max(1, Math.floor((Date.now() - (startTime || Date.now())) / 1000));
                onFinish({ mistakes, mistakeKeys, duration });
            }
        } else {
            setMistakes(prev => ({ ...prev, [currentIndex]: true }));
            setMistakeKeys(prev => [...prev, expectedChar]);
            setIsErrorState(true);
        }
    };

    const renderText = () => {
        return text.split('').map((char, index) => {
            let className = "text-gray-500";
            if (index < currentIndex) {
                className = mistakes[index] ? "text-red-400 underline decoration-red-500/50" : "text-white neon-text-primary";
            } else if (index === currentIndex) {
                className = `bg-primary/20 text-white border-b-2 ${isErrorState ? 'border-red-500 bg-red-500/20' : 'border-primary animate-pulse'}`;
            }
            return <span key={index} className={className}>{char}</span>;
        });
    };

    return (
        <div className="flex flex-col gap-12 w-full h-full">
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

            <div
                className="font-mono text-3xl md:text-5xl leading-relaxed md:leading-loose tracking-wide break-words select-none text-center px-4 cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {renderText()}
            </div>

            <div className="mt-auto">
                <VirtualKeyboard
                    currentExpectedKey={text[currentIndex] || ""}
                    lastPressedKey={lastKeyPressed}
                    isError={isErrorState}
                />
            </div>
        </div>
    );
}
