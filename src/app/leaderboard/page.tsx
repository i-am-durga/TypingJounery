"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";

import { User } from "@/types";

interface LeaderboardUser extends User {
    rank: number;
    badgesCount: number;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/leaderboard");
                if (res.ok) {
                    const data = await res.json();
                    // Provide mock data if real data is empty
                    if (data.leaderboard && data.leaderboard.length > 0) {
                        setLeaderboard(data.leaderboard);
                    } else {
                        setLeaderboard([
                            { id: "1", rank: 1, name: "NeonTypist99", wpm: 142, accuracy: 99, level: 4, badgesCount: 15 },
                            { id: "2", rank: 2, name: "SpeedDemon", wpm: 138, accuracy: 97, level: 4, badgesCount: 12 },
                            { id: "3", rank: 3, name: "KeyboardWarrior", wpm: 135, accuracy: 100, level: 4, badgesCount: 14 },
                            { id: "4", rank: 4, name: "TypingJouneryDev", wpm: 120, accuracy: 96, level: 3, badgesCount: 8 },
                            { id: "5", rank: 5, name: "QuickFingers", wpm: 115, accuracy: 98, level: 3, badgesCount: 7 },
                            { id: "6", rank: 6, name: "QWERTYMaster", wpm: 108, accuracy: 94, level: 3, badgesCount: 6 },
                            { id: "7", rank: 7, name: "SilentSwitches", wpm: 103, accuracy: 99, level: 2, badgesCount: 5 },
                        ]);
                    }
                }
            } catch {
                console.error("Failed to load leaderboard");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="w-6 h-6 text-yellow-500 [filter:drop-shadow(0_0_10px_rgba(234,179,8,0.8))]" />;
            case 2: return <Medal className="w-6 h-6 text-gray-300 [filter:drop-shadow(0_0_10px_rgba(209,213,219,0.8))]" />;
            case 3: return <Medal className="w-6 h-6 text-amber-700 [filter:drop-shadow(0_0_10px_rgba(180,83,9,0.8))]" />;
            default: return <span className="font-bold text-gray-400 text-lg w-6 text-center">{rank}</span>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
                    Global <span className="text-secondary neon-text-secondary">Leaderboard</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                    The fastest touch typists in the world. Compete for the top spot.
                </p>

                <div className="flex justify-center gap-2">
                    <div className="px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-sm">All Time</div>
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer text-sm">This Week</div>
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer text-sm">Today</div>
                </div>
            </div>

            <div className="bg-navy-light/50 border border-white/10 rounded-3xl overflow-hidden glass-panel">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 bg-black/20 text-gray-400 text-sm font-bold uppercase tracking-wider">
                    <div className="col-span-2 text-center">Rank</div>
                    <div className="col-span-4">Typist</div>
                    <div className="col-span-2 text-center hidden md:block">Acc</div>
                    <div className="col-span-2 text-center hidden md:block">Badges</div>
                    <div className="col-span-4 md:col-span-2 text-right md:text-center text-primary">WPM</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">Loading ranks...</div>
                    ) : leaderboard.map((user, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            className={`grid grid-cols-12 gap-4 p-4 md:p-6 items-center transition-colors hover:bg-white/5 ${idx < 3 ? 'bg-white/[0.02]' : ''}`}
                        >
                            <div className="col-span-2 flex justify-center">
                                {getRankIcon(user.rank)}
                            </div>

                            <div className="col-span-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center font-bold text-white shadow-inner border border-white/10">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm md:text-base truncate ${idx === 0 ? 'text-secondary neon-text-secondary font-heading' : 'text-white'}`}>
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500">Level {user.level}</div>
                                </div>
                            </div>

                            <div className="col-span-2 text-center hidden md:block text-gray-300 font-mono">
                                {user.accuracy}%
                            </div>

                            <div className="col-span-2 text-center hidden md:flex justify-center items-center gap-1 text-gray-300 font-mono">
                                <Star className="w-3 h-3 text-secondary" /> {user.badgesCount}
                            </div>

                            <div className="col-span-4 md:col-span-2 text-right md:text-center">
                                <span className={`font-mono text-xl md:text-2xl font-bold ${idx === 0 ? 'text-secondary' : 'text-primary'}`}>
                                    {user.wpm}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
