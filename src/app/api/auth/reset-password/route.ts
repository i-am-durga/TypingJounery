import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
        }

        // Verify JWT token
        let payload: { userId: string; email: string; purpose: string };
        try {
            payload = jwt.verify(token, JWT_SECRET) as typeof payload;
        } catch {
            return NextResponse.json({ message: "Reset link is invalid or has expired. Please request a new one." }, { status: 400 });
        }

        if (payload.purpose !== "reset") {
            return NextResponse.json({ message: "Invalid reset token" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const newHash = await bcrypt.hash(newPassword, 12);
        await User.findByIdAndUpdate(payload.userId, { passwordHash: newHash });

        return NextResponse.json({ message: "Password reset successfully! You can now sign in." }, { status: 200 });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
