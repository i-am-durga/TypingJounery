import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Session as TypingSession } from "@/models/Session";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
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

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "30");

        const recentSessions = await TypingSession.find({ userId: user._id })
            .sort({ completedAt: -1 })
            .limit(limit);

        return NextResponse.json({ sessions: recentSessions }, { status: 200 });
    } catch (error) {
        console.error("Sessions fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
