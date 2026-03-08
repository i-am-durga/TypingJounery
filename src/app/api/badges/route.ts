import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Badge } from "@/models/Badge";

const BADGE_DEFINITIONS = [
    { id: "first-lesson", name: "First Lesson", description: "Completed your first typing lesson", icon: "🌱" },
    { id: "speed-demon-80", name: "Speed Demon", description: "Reached 80 WPM", icon: "🚀" },
    { id: "perfectionist", name: "Perfectionist", description: "Achieved 100% accuracy in a lesson", icon: "🎯" },
    { id: "week-warrior", name: "Week Warrior", description: "Maintained a 7-day streak", icon: "🔥" },
    { id: "polyglot", name: "Polyglot", description: "Practiced in multiple languages", icon: "🌐" },
    { id: "century", name: "Century", description: "Completed 100 lessons", icon: "💯" },
    { id: "master-typist", name: "Master Typist", description: "Reached Expert Level", icon: "👑" },
];

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

        const earnedBadges = await Badge.find({ userId: user._id });
        const earnedBadgeIds = earnedBadges.map(b => b.badgeId);

        const allBadges = BADGE_DEFINITIONS.map(def => ({
            ...def,
            earned: earnedBadgeIds.includes(def.id),
            earnedAt: earnedBadges.find(b => b.badgeId === def.id)?.earnedAt || null
        }));

        return NextResponse.json({ badges: allBadges }, { status: 200 });
    } catch (error) {
        console.error("Badges fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
