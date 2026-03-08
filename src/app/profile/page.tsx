"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Settings, LogOut, Award, Download } from "lucide-react";
import { motion } from "framer-motion";

interface UserProfile {
    name: string;
    email: string;
    currentLevel: number;
    totalXP: number;
    streak: number;
    language: string;
    unlockedLessons?: string[];
}

interface BadgeDef {
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedAt?: string;
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [badges, setBadges] = useState<BadgeDef[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", language: "" });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, badgesRes] = await Promise.all([
                    fetch("/api/user/profile"),
                    fetch("/api/badges")
                ]);

                if (profileRes.ok) {
                    const data = await profileRes.json();
                    setProfile(data.user);
                    setFormData({ name: data.user.name, language: data.user.language || "english" });
                }

                if (badgesRes.ok) {
                    const data = await badgesRes.json();
                    setBadges(data.badges);
                }
            } catch {
                console.error("Failed to load profile");
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data.user);
                setIsEditing(false);
                setMessage("Profile updated successfully");
                setTimeout(() => setMessage(""), 3000);
            } else {
                setMessage("Failed to update profile");
            }
        } catch {
            setMessage("An error occurred");
        }
    };

    if (!session || !profile) {
        return <div className="p-12 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-heading font-black text-white mb-8">
                Your <span className="text-primary neon-text-primary">Profile</span>
            </h1>

            {message && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Settings & Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-navy/60 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md p-6 rounded-2xl">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-4xl font-bold text-navy shadow-[0_0_30px_rgba(0,229,255,0.4)] mb-4 border-2 border-white/20">
                                {profile.name.substring(0, 1).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Level {profile.currentLevel} Typist
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-6 space-y-4">
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                className={`w-full justify-start ${isEditing ? 'bg-primary text-navy hover:bg-primary-hover' : 'border-white/10 text-gray-300 hover:text-white hover:bg-white/5'}`}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-start border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>

                    {profile.currentLevel >= 4 && (
                        <div className="bg-navy/60 backdrop-blur-md p-6 rounded-2xl border border-secondary/30 shadow-[0_0_25px_rgba(255,183,3,0.15)] relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>
                            <h3 className="font-bold text-white flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-secondary" />
                                Expert Certificate
                            </h3>
                            <p className="text-xs text-gray-400 mb-4">
                                You&apos;ve reached Expert level! Download your official TypingJounery typing certificate.
                            </p>
                            <Button className="w-full bg-secondary hover:bg-secondary-hover text-navy font-bold shadow-[0_0_20px_rgba(255,183,3,0.3)] hover:shadow-[0_0_30px_rgba(255,183,3,0.5)] transition-shadow">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right Column - Details & Badges */}
                <div className="md:col-span-2 space-y-6">
                    {isEditing ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-navy/60 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md p-8 rounded-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Edit Information</h3>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-300 flex items-center gap-2"><User className="w-4 h-4" /> Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-navy/80 border-white/5 text-white h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-300 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                                    <Input
                                        id="email"
                                        value={profile.email}
                                        disabled
                                        className="bg-navy/50 border-white/5 text-gray-500 h-12 rounded-xl"
                                    />
                                    <p className="text-xs text-gray-500">Email cannot be changed.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="language" className="text-gray-300">Primary Language</Label>
                                    <select
                                        id="language"
                                        className="flex h-12 w-full rounded-xl border border-white/5 bg-navy/80 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300 cursor-pointer"
                                        value={formData.language}
                                        onChange={e => setFormData({ ...formData, language: e.target.value })}
                                    >
                                        <option value="english">English</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="nepali">Nepali</option>
                                    </select>
                                </div>

                                <Button type="submit" className="w-full bg-primary text-navy hover:bg-primary-hover font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all mt-4">
                                    Save Changes
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <>
                            {/* Stats Overview Mini */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-navy/60 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md p-4 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-primary">{profile.totalXP}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Total XP</div>
                                </div>
                                <div className="bg-navy/60 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md p-4 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-orange-400">{profile.streak}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Day Streak</div>
                                </div>
                                <div className="bg-navy/60 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md p-4 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-secondary">{profile.unlockedLessons?.length || 0}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Lessons</div>
                                </div>
                            </div>

                            {/* Full Badges Showcase */}
                            <div className="bg-navy/60 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md p-8 rounded-2xl mt-6">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Badge Collection</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {badges.map((badge, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${badge.earned ? 'bg-navy/80 border-primary/30 shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.2)] hover:border-primary/50' : 'bg-navy-dark/50 border-white/5 opacity-40 grayscale blur-[0.5px] hover:blur-none hover:opacity-60'}`}
                                        >
                                            <div className="text-4xl mb-3 drop-shadow-lg">{badge.icon}</div>
                                            <div className="font-bold text-sm text-center text-white mb-1">{badge.name}</div>
                                            <div className="text-[10px] text-center text-gray-500 leading-tight">{badge.description}</div>

                                            {badge.earned && badge.earnedAt && (
                                                <div className="absolute -top-2 -right-2 bg-secondary text-navy text-[8px] font-black px-2 py-1 rounded-full shadow-lg">
                                                    EARNED
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
