import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Session as TypingSession } from "@/models/Session";
import { Badge } from "@/models/Badge";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { wpm, accuracy, duration, language, mistakeKeys } = await req.json();

        if (wpm === undefined || accuracy === undefined || duration === undefined) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Save session
        const newSession = await TypingSession.create({
            userId: user._id,
            lessonId: params.id,
            wpm,
            accuracy,
            duration,
            language: language || user.language,
            mistakeKeys: mistakeKeys || [],
        });

        // Gamification Logic
        let xpEarned = 10; // Base XP for completing a lesson
        if (accuracy >= 95) xpEarned += 5; // High accuracy bonus

        // Check for new WPM record
        const pastSessions = await TypingSession.find({ userId: user._id });
        const bestWpmSoFar = pastSessions.length > 1 ? Math.max(...pastSessions.filter(s => s._id.toString() !== newSession._id.toString()).map(s => s.wpm)) : 0;

        if (wpm > bestWpmSoFar && pastSessions.length > 1) {
            xpEarned += 10; // New WPM record bonus
        }

        user.totalXP += xpEarned;

        // Level up logic
        let newLevel = 1; // Beginner
        if (user.totalXP > 100) newLevel = 2; // Intermediate
        if (user.totalXP > 500) newLevel = 3; // Advanced
        if (user.totalXP > 1500) newLevel = 4; // Expert

        user.currentLevel = newLevel;

        // Streak logic - simplified: if lastPracticeDate is yesterday, increment. If today, same. If older, reset to 1.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (user.lastPracticeDate) {
            const lastPractice = new Date(user.lastPracticeDate);
            lastPractice.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today.getTime() - lastPractice.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                user.streak += 1;
            } else if (diffDays > 1) {
                user.streak = 1;
            }
            // If diffDays === 0, keep same streak
        } else {
            user.streak = 1;
        }

        user.lastPracticeDate = new Date();

        // Add lesson to unlocked list (basic assumption: next lesson unlocked)
        if (!user.unlockedLessons.includes(params.id)) {
            user.unlockedLessons.push(params.id);
        }

        await user.save();

        // Check and award badges
        const newBadges = [];
        if (pastSessions.length === 1) newBadges.push("first-lesson");
        if (wpm >= 80) newBadges.push("speed-demon-80");
        if (accuracy === 100) newBadges.push("perfectionist");
        if (user.streak >= 7) newBadges.push("week-warrior");
        if (pastSessions.length === 100) newBadges.push("century");
        if (newLevel === 4) newBadges.push("master-typist");

        const existingBadges = await Badge.find({ userId: user._id }).select('badgeId');
        const existingBadgeIds = existingBadges.map(b => b.badgeId);

        for (const badge of newBadges) {
            if (!existingBadgeIds.includes(badge)) {
                await Badge.create({ userId: user._id, badgeId: badge });
            }
        }

        return NextResponse.json({
            message: "Session saved",
            xpEarned,
            level: user.currentLevel,
            streak: user.streak,
            newBadges: newBadges.filter(b => !existingBadgeIds.includes(b))
        }, { status: 200 });

    } catch (error) {
        console.error("Lesson complete error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
