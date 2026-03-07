import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ email });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
        }

        // Generate secure JWT reset token (15 min expiry)
        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email, purpose: "reset" },
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const resetUrl = `${baseUrl}/reset-password?token=${token}`;

        await sendPasswordResetEmail(user.email, resetUrl, user.name);

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
