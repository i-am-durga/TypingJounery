import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Session as TypingSession } from "@/models/Session";

export async function GET() {
    try {
        await connectDB();

        // Simple leaderboard: top 100 users by highest WPM
        // To do this efficiently, we find the highest WPM session per user, but for prototyping we can just group or fetch top sessions and get users

        const topSessions = await TypingSession.find()
            .sort({ wpm: -1 })
            .limit(500)
            .populate('userId', 'name language currentLevel badges');

        // Group by user and take their best
        const userBestWPM = new Map();

        for (const session of topSessions) {
            if (!session.userId) continue; // Deleted user string

            const userIdStr = session.userId._id.toString();
            if (!userBestWPM.has(userIdStr)) {
                userBestWPM.set(userIdStr, {
                    user: session.userId,
                    wpm: session.wpm,
                    accuracy: session.accuracy
                });
            }
        }

        const leaderboard = Array.from(userBestWPM.values())
            .slice(0, 100)
            .map((entry, index) => ({
                rank: index + 1,
                name: entry.user.name,
                language: entry.user.language,
                level: entry.user.currentLevel,
                wpm: entry.wpm,
                accuracy: entry.accuracy,
                badgesCount: entry.user.badges?.length || 0
            }));

        return NextResponse.json({ leaderboard }, { status: 200 });
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
