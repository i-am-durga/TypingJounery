"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Keyboard, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── LEVELS ──────────────────────────────────────────────────────────────────
const LEVELS = [
    { id: 1, name: "a s", keys: ["a", "s"], title: "Level 1 – Left Pinky & Ring" },
    { id: 2, name: "a s d", keys: ["a", "s", "d"], title: "Level 2 – Add Middle Finger" },
    { id: 3, name: "a s d f", keys: ["a", "s", "d", "f"], title: "Level 3 – Full Left Hand" },
    { id: 4, name: "j k l ;", keys: ["j", "k", "l", ";"], title: "Level 4 – Right Hand Home" },
    { id: 5, name: "Home Row", keys: ["a", "s", "d", "f", "j", "k", "l", ";"], title: "Level 5 – Full Home Row" },
    { id: 6, name: "+ e i", keys: ["a", "s", "d", "f", "j", "k", "l", ";", "e", "i"], title: "Level 6 – Add e & i" },
    { id: 7, name: "+ r u", keys: ["a", "s", "d", "f", "j", "k", "l", ";", "e", "i", "r", "u"], title: "Level 7 – Add r & u" },
    { id: 8, name: "All Letters", keys: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], title: "Level 8 – All Letters" },
];

// Finger assignment (f1=pinky, f2=ring, f3=middle, f4=index)
const FINGER: Record<string, string> = {
    q: 'f1', a: 'f1', z: 'f1', w: 'f2', s: 'f2', x: 'f2', e: 'f3', d: 'f3', c: 'f3',
    r: 'f4', f: 'f4', v: 'f4', t: 'f4', b: 'f4', y: 'f4', h: 'f4', n: 'f4',
    u: 'f4', j: 'f4', m: 'f4', i: 'f3', k: 'f3', ',': 'f3', o: 'f2', l: 'f2', '.': 'f2',
    p: 'f1', ';': 'f1', '/': 'f1'
};

const KEYBOARD_ROWS = [
    [
        { k: '`', c: '`' }, { k: '1' }, { k: '2' }, { k: '3' }, { k: '4' }, { k: '5' },
        { k: '6' }, { k: '7' }, { k: '8' }, { k: '9' }, { k: '0' }, { k: '-' }, { k: '=' },
        { k: '⌫', w: 'w-[118px] text-[0.8rem]', id: 'Backspace' }
    ],
    [
        { k: 'Tab', w: 'w-[86px] text-[0.8rem]', id: 'Tab' },
        { k: 'q' }, { k: 'w' }, { k: 'e' }, { k: 'r' }, { k: 't' },
        { k: 'y' }, { k: 'u' }, { k: 'i' }, { k: 'o' }, { k: 'p' },
        { k: '[' }, { k: ']' }, { k: '\\', w: 'w-[88px] text-[0.8rem]' }
    ],
    [
        { k: 'Caps', w: 'w-[108px] text-[0.8rem]', id: 'CapsLock' },
        { k: 'a' }, { k: 's' }, { k: 'd' }, { k: 'f' }, { k: 'g' },
        { k: 'h' }, { k: 'j' }, { k: 'k' }, { k: 'l' }, { k: ';' }, { k: "'" },
        { k: 'Enter', w: 'w-[130px] text-[0.8rem]', id: 'Enter' }
    ],
    [
        { k: 'Shift', w: 'w-[130px] text-[0.8rem]', id: 'ShiftLeft' },
        { k: 'z' }, { k: 'x' }, { k: 'c' }, { k: 'v' }, { k: 'b' },
        { k: 'n' }, { k: 'm' }, { k: ',' }, { k: '.' }, { k: '/' },
        { k: 'Shift', w: 'w-[172px] text-[0.8rem]', id: 'ShiftRight' }
    ],
    [{ k: 'Space', w: 'w-[450px]', id: 'Space' }]
];

// Finger Colors based off theme
const FINGER_STYLES: Record<string, string> = {
    f1: "border-[color:var(--f1)] border-b-[color:color-mix(in_srgb,var(--f1)_70%,black)] bg-[color:color-mix(in_srgb,var(--f1)_10%,var(--keyBg))]",
    f2: "border-[color:var(--f2)] border-b-[color:color-mix(in_srgb,var(--f2)_70%,black)] bg-[color:color-mix(in_srgb,var(--f2)_10%,var(--keyBg))]",
    f3: "border-[color:var(--f3)] border-b-[color:color-mix(in_srgb,var(--f3)_70%,black)] bg-[color:color-mix(in_srgb,var(--f3)_10%,var(--keyBg))]",
    f4: "border-[color:var(--f4)] border-b-[color:color-mix(in_srgb,var(--f4)_70%,black)] bg-[color:color-mix(in_srgb,var(--f4)_10%,var(--keyBg))]",
};

// ─── GENERATE PRACTICE TEXT ───────────────────────────────────────────────────
function generateText(keys: string[], length = 60) {
    const pool: string[] = [];
    keys.forEach(k => pool.push(k + k + k));
    for (let i = 0; i < keys.length; i++)
        for (let j = 0; j < keys.length; j++)
            if (i !== j) pool.push(keys[i] + keys[j]);

    for (let i = 0; i < keys.length; i++)
        for (let j = 0; j < keys.length; j++)
            for (let k2 = 0; k2 < keys.length; k2++)
                if (keys.length <= 6) pool.push(keys[i] + keys[j] + keys[k2]);

    let result = '';
    while (result.replace(/ /g, '').length < length) {
        if (pool.length === 0) break;
        const word = pool[Math.floor(Math.random() * pool.length)];
        result += word + ' ';
    }
    return result.trim().slice(0, length);
}

export default function BeginnerModePage() {
    const { data: session } = useSession();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [text, setText] = useState("");
    const [typed, setTyped] = useState(0);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
    const [wrongKeyId, setWrongKeyId] = useState<string | null>(null);
    const [shake, setShake] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // Initial load
    useEffect(() => {
        loadLevel(currentLevel);
    }, [currentLevel]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime && !completed) {
            interval = setInterval(() => {
                setElapsed((Date.now() - startTime) / 1000);
            }, 200);
        }
        return () => clearInterval(interval);
    }, [startTime, completed]);

    // Force focus
    useEffect(() => {
        const handleGlobalClick = () => {
            if (!completed) inputRef.current?.focus();
        };
        document.addEventListener("click", handleGlobalClick);
        inputRef.current?.focus();
        return () => document.removeEventListener("click", handleGlobalClick);
    }, [completed]);

    const loadLevel = (idx: number) => {
        setText(generateText(LEVELS[idx].keys));
        setTyped(0);
        setErrors(0);
        setStartTime(null);
        setElapsed(0);
        setCompleted(false);
        setWrongKeyId(null);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (completed) return;
        if (e.key === 'Backspace' || e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();
            return;
        }

        if (!startTime) {
            setStartTime(Date.now());
        }

        const expected = text[typed];
        if (e.key === expected) {
            setTyped(prev => prev + 1);
            if (typed + 1 === text.length) {
                setCompleted(true);
                setCompletedLevels(prev => new Set(prev).add(currentLevel));
            }
            setWrongKeyId(null);
        } else {
            setErrors(prev => prev + 1);
            setWrongKeyId(e.key.toLowerCase());
            setShake(true);
            setTimeout(() => setShake(false), 200);
            setTimeout(() => setWrongKeyId(null), 300);
        }
        e.preventDefault();
    };

    const wpm = elapsed > 0 ? Math.round((typed / 5) / (elapsed / 60)) : 0;
    const total = typed + errors;
    const accuracy = total > 0 ? Math.round((typed / total) * 100) : 100;
    const isLast = currentLevel === LEVELS.length - 1;

    // Computed Styles config mapping for dynamic themes
    const customVariables = {
        "--f1": "#818cf8",
        "--f2": "#38bdf8",
        "--f3": "#fb923c",
        "--f4": "#f472b6",
        "--keyBg": "hsl(var(--card))",
    } as React.CSSProperties;

    return (
        <div className="h-[100dvh] overflow-hidden bg-background text-foreground font-sans relative" style={customVariables}>
            {/* Subtle Grid Pattern Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="w-full px-4 sm:px-8 md:px-16 py-4 relative z-10 flex flex-col h-full max-w-[1600px] mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-border pb-3 mb-3 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="bg-primary/10 border border-primary/30 text-primary text-[0.7rem] font-bold tracking-[1.5px] uppercase px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,180,216,0.2)] ml-2">
                            Beginner Mode
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                        {session && (
                            <Avatar className="h-9 w-9 border border-primary/30">
                                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </header>

                {/* Level Selector */}
                <div className="mb-3 shrink-0">
                    <div className="text-[0.75rem] font-semibold text-muted-foreground tracking-[1.5px] uppercase mb-3">
                        Choose Level
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {LEVELS.map((lvl, idx) => {
                            const isCurrent = idx === currentLevel;
                            const isDone = completedLevels.has(idx);
                            return (
                                <button
                                    key={lvl.id}
                                    onClick={() => setCurrentLevel(idx)}
                                    className={`
                                        font-mono text-[0.78rem] font-semibold px-4 py-2 rounded-xl transition-all border flex flex-col items-center gap-1
                                        ${isCurrent ? 'bg-primary/15 border-primary text-primary shadow-[0_0_15px_rgba(0,180,216,0.15)]' :
                                            isDone ? 'bg-card border-primary/40 text-primary/70' :
                                                'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
                                        }
                                    `}
                                >
                                    <span className={`text-[0.6rem] ${isCurrent || isDone ? 'text-primary' : 'text-muted-foreground'}`}>
                                        L{lvl.id}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {lvl.name} {isDone && !isCurrent && <CheckCircle className="w-3 h-3 text-primary" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-3 mb-3 shrink-0">
                    {[
                        { val: wpm, label: "WPM", color: "text-primary" },
                        { val: `${accuracy}%`, label: "Accuracy", color: "text-blue-400" },
                        { val: `${Math.round(elapsed)}s`, label: "Time", color: "text-orange-400" },
                        { val: errors, label: "Errors", color: "text-red-400" },
                    ].map((s, i) => (
                        <div key={i} className="bg-card border border-border rounded-xl p-3 text-center shadow-lg">
                            <div className={`font-mono text-2xl font-bold leading-none mb-1 ${s.color}`}>
                                {s.val}
                            </div>
                            <div className="text-[0.68rem] text-muted-foreground font-semibold tracking-wider uppercase">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Typing Area */}
                <div className="bg-card border border-border rounded-2xl p-4 mb-3 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="text-[0.85rem] font-bold text-primary">
                            {LEVELS[currentLevel].title}
                        </div>
                        <div className="w-40 h-[6px] bg-background rounded-full overflow-hidden border border-border">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-300"
                                style={{ width: `${(typed / text.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div
                        className={`font-mono text-2xl font-semibold tracking-[6px] leading-relaxed bg-background/50 border border-border rounded-xl p-4 min-h-[70px] flex items-center flex-wrap gap-[2px] mb-2 select-none relative z-10 ${shake ? 'animate-shake' : ''}`}
                        onClick={() => inputRef.current?.focus()}
                    >
                        {Array.from(text).map((char, i) => {
                            let statusClass = "text-muted-foreground"; // Pending default
                            if (i < typed) {
                                statusClass = "text-primary drop-shadow-[0_0_8px_rgba(0,180,216,0.6)]"; // Correct
                            } else if (i === typed) {
                                statusClass = "text-foreground bg-primary/20 rounded shadow-[inset_0_0_10px_rgba(0,180,216,0.3)] animate-pulse"; // Current
                            }

                            return (
                                <span key={i} className={`relative ${statusClass}`}>
                                    {char === ' ' ? '\u00a0' : char}
                                </span>
                            );
                        })}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        className="absolute opacity-0 pointer-events-none w-0 h-0"
                        onKeyDown={handleKeyDown}
                        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                    />

                    {!startTime && !completed && (
                        <div className="text-center text-muted-foreground text-sm py-2 animate-bounce flex justify-center gap-2 items-center relative z-10">
                            Click here or press <span className="bg-background border border-border px-2 py-0.5 rounded font-mono text-primary text-xs">any key</span> to start typing
                        </div>
                    )}

                    {completed && (
                        <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-2">
                                {isLast ? '🏆 All Levels Complete!' : '🎉 Level Complete!'}
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                {wpm} WPM · {accuracy}% Accuracy · {Math.round(elapsed)}s
                            </p>
                            <Button
                                onClick={() => loadLevel(isLast ? 0 : currentLevel + 1)}
                                className="bg-primary text-foreground font-bold rounded-xl shadow-[0_0_20px_rgba(0,180,216,0.3)] hover:scale-105 transition-all text-lg px-8 h-12"
                            >
                                {isLast ? 'Restart Journey →' : 'Next Level →'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Keyboard Section */}
                <div className="bg-card border border-border rounded-2xl p-4 shadow-lg shrink-0">
                    <div className="text-[0.72rem] text-muted-foreground font-semibold tracking-[1.5px] uppercase mb-4 text-center">
                        On-Screen Keyboard — highlighted keys for this level
                    </div>
                    <div className="flex flex-col gap-[8px] items-center">
                        {KEYBOARD_ROWS.map((row, rIdx) => (
                            <div key={rIdx} className="flex gap-[8px]">
                                {row.map((kDef, kIdx) => {
                                    const rawKey = (kDef.id || kDef.k).toLowerCase();
                                    const fingerToken = FINGER[rawKey] || '';
                                    const nextChar = text[typed]?.toLowerCase();

                                    // Status calculations
                                    const isTargetKey = !completed && nextChar === rawKey;
                                    const isWrongKey = wrongKeyId === rawKey;
                                    const isInLevel = LEVELS[currentLevel].keys.includes(rawKey);

                                    // Dynamic Styling Classes
                                    let styleClass = "bg-[var(--keyBg)] border-[#333a52] border-b-[#1a1e2e]"; // Default
                                    if (isWrongKey) {
                                        styleClass = "bg-red-500 text-white border-red-600 border-b-red-700 shadow-[0_0_15px_rgba(244,63,94,0.6)] translate-y-[2px]";
                                    } else if (isTargetKey) {
                                        styleClass = "bg-primary text-background border-primary border-b-green-500 shadow-[0_0_15px_rgba(74,222,128,0.6)] translate-y-[2px]";
                                    } else if (isInLevel && fingerToken) {
                                        styleClass = `text-foreground ${FINGER_STYLES[fingerToken]}`;
                                    }

                                    return (
                                        <div
                                            key={kIdx}
                                            className={`
                                                w-[56px] h-[56px] border rounded-lg flex flex-col items-center justify-center
                                                font-mono text-[1.1rem] font-semibold text-muted-foreground transition-all duration-150
                                                border-b-[4px]
                                                ${kDef.w || ''}
                                                ${styleClass}
                                            `}
                                        >
                                            {kDef.k}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Finger legend */}
                    <div className="flex gap-4 mt-4 justify-center flex-wrap">
                        {[
                            { color: "#818cf8", label: "Pinky" },
                            { color: "#38bdf8", label: "Ring" },
                            { color: "#fb923c", label: "Middle" },
                            { color: "#f472b6", label: "Index" }
                        ].map((leg, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[0.72rem] text-muted-foreground font-medium">
                                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: leg.color }}></div> {leg.label}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
