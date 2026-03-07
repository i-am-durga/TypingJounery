"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, Clock, Target, Play, Zap } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Record<string, number | string> | null>(null);
    const [sessions, setSessions] = useState<Record<string, unknown>[]>([]);
    const [badges, setBadges] = useState<Record<string, unknown>[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, sessionsRes, badgesRes] = await Promise.all([
                    fetch("/api/user/stats"),
                    fetch("/api/user/sessions?limit=30"),
                    fetch("/api/badges")
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (sessionsRes.ok) setSessions((await sessionsRes.json()).sessions);
                if (badgesRes.ok) setBadges((await badgesRes.json()).badges);
            } catch {
                console.error("Failed to fetch dashboard data");
            }
        };

        if (session) {
            fetchData();
        }
    }, [session]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const getLevelName = (level: number) => {
        switch (level) {
            case 1: return "Beginner";
            case 2: return "Intermediate";
            case 3: return "Advanced";
            case 4: return "Expert";
            default: return "Beginner";
        }
    };

    const getXpMax = (level: number) => {
        switch (level) {
            case 1: return 100;
            case 2: return 500;
            case 3: return 1500;
            default: return 5000;
        }
    };

    const chartData = [...sessions].reverse().map((s, i) => ({
        name: `#${i + 1}`,
        wpm: s.wpm,
        accuracy: s.accuracy
    }));

    if (!session) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">
                        {getGreeting()}, <span className="text-primary">{session.user?.name}</span>
                    </h1>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Flame className="text-orange-500 w-5 h-5" />
                        <span className="font-medium">Day {stats?.streak || 0} streak!</span>
                    </div>
                </div>

                {/* Quick Start actions — now wired up */}
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                    <Button className="bg-primary hover:bg-primary-hover text-navy font-bold gap-2" asChild>
                        <Link href="/path">
                            <Play className="w-4 h-4" /> Resume Path
                        </Link>
                    </Button>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2 text-white" asChild>
                        <Link href="/practice">
                            <Zap className="w-4 h-4 text-secondary" /> Daily Drill
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                {/* Stats Summary */}
                <div className="col-span-1 md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-navy-light border-white/10 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                                Today&apos;s Avg
                                <Zap className="w-4 h-4 text-secondary" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold neon-text-secondary text-secondary">{stats?.todayWPM || 0}</div>
                            <p className="text-xs text-gray-500 mt-1">WPM</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-navy-light border-white/10 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                                Best Speed
                                <Trophy className="w-4 h-4 text-primary" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold neon-text-primary text-primary">{stats?.bestWPM || 0}</div>
                            <p className="text-xs text-gray-500 mt-1">WPM All-Time</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-navy-light border-white/10 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                                Accuracy
                                <Target className="w-4 h-4 text-green-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stats?.avgAccuracy || 0}%</div>
                            <p className="text-xs text-gray-500 mt-1">Average</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-navy-light border-white/10 shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                                Practice Time
                                <Clock className="w-4 h-4 text-blue-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stats?.totalMinutes || 0}m</div>
                            <p className="text-xs text-gray-500 mt-1">Total Time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Level Progress */}
                <div className="col-span-1 md:col-span-4">
                    <Card className="bg-navy-light border-primary/30 shadow-[0_0_15px_rgba(0,229,255,0.1)] h-full">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Current Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-2xl font-bold text-primary">{getLevelName(Number(stats?.level || 1))}</span>
                                <span className="text-sm text-gray-400">Level {stats?.level || 1}</span>
                            </div>
                            <Progress
                                value={(Number(stats?.xp || 0) / getXpMax(Number(stats?.level || 1))) * 100}
                                className="h-3 bg-white/10"
                            />
                            <div className="mt-2 text-right text-xs text-gray-400">
                                {stats?.xp || 0} / {getXpMax(Number(stats?.level || 1))} XP
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progress Chart */}
                <div className="md:col-span-2">
                    <Card className="bg-navy-light border-white/10 col-span-2 h-full">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Progress (WPM)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0A0F1E', borderColor: '#ffffff20', borderRadius: '8px' }}
                                                itemStyle={{ color: '#00E5FF' }}
                                            />
                                            <Line type="monotone" dataKey="wpm" stroke="#00E5FF" strokeWidth={3} dot={{ r: 4, fill: '#0A0F1E', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-4 text-gray-500">
                                        <p>No session data yet. Start practicing!</p>
                                        <Button className="bg-primary text-navy font-bold" asChild>
                                            <Link href="/practice">Start Practice</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Badges */}
                <div>
                    <Card className="bg-navy-light border-white/10 h-full">
                        <CardHeader>
                            <CardTitle className="text-white flex justify-between items-center">
                                Badges
                                <Link href="/profile" className="text-xs text-primary font-normal hover:underline">View All</Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            {badges.length > 0 ? (
                                badges.slice(0, 6).map((badge, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col items-center justify-center w-[80px] p-2 rounded-xl transition-all ${badge.earned ? 'bg-white/5 border border-primary/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]' : 'opacity-40 grayscale blur-[1px]'}`}
                                        title={badge.name as string}
                                    >
                                        <span className="text-3xl mb-1">{badge.icon as string}</span>
                                        <span className="text-[10px] text-center text-gray-300 leading-tight">{badge.name as string}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 text-center w-full py-8">
                                    Complete lessons to earn badges!
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
