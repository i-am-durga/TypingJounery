import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Session as TypingSession } from "@/models/Session";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Calculate aggregated stats
        const sessions = await TypingSession.find({ userId: user._id });

        let totalDuration = 0;
        let bestWPM = 0;
        let avgWPM = 0;
        let avgAccuracy = 0;

        if (sessions.length > 0) {
            totalDuration = sessions.reduce((acc, curr) => acc + curr.duration, 0) / 60; // in minutes
            bestWPM = Math.max(...sessions.map(s => s.wpm));
            avgWPM = sessions.reduce((acc, curr) => acc + curr.wpm, 0) / sessions.length;
            avgAccuracy = sessions.reduce((acc, curr) => acc + curr.accuracy, 0) / sessions.length;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysSessions = sessions.filter(s => new Date(s.completedAt) >= today);
        const todayWPM = todaysSessions.length > 0
            ? todaysSessions.reduce((acc, curr) => acc + curr.wpm, 0) / todaysSessions.length
            : 0;

        return NextResponse.json({
            level: user.currentLevel,
            xp: user.totalXP,
            streak: user.streak,
            bestWPM: Math.round(bestWPM),
            avgWPM: Math.round(avgWPM),
            todayWPM: Math.round(todayWPM),
            avgAccuracy: Math.round(avgAccuracy),
            totalMinutes: Math.round(totalDuration),
        }, { status: 200 });

    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
