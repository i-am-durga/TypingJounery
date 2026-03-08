"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
    startTime: number | null;
    isFinished: boolean;
    onTick?: (seconds: number) => void;
}

export function Timer({ startTime, isFinished, onTick }: TimerProps) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime && !isFinished) {
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setSeconds(elapsed);
                if (onTick) onTick(elapsed);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, isFinished, onTick]);

    return (
        <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-mono font-bold text-white">{seconds}s</span>
        </div>
    );
}
