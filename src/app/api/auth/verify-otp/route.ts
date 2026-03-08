import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { OTP } from "@/models/OTP";
import { rateLimit } from "@/lib/rateLimiter";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "anonymous";
        const { success } = rateLimit(ip, 10, 60000); // 10 attempts per minute

        if (!success) {
            return NextResponse.json({ message: "Too many attempts. Please try again in a minute." }, { status: 429 });
        }

        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP code are required" }, { status: 400 });
        }

        await connectDB();

        const otpDoc = await OTP.findOne({ email, purpose: "verify", used: false });

        if (!otpDoc) {
            return NextResponse.json({ message: "Invalid or expired code. Please request a new one." }, { status: 400 });
        }

        if (new Date() > otpDoc.expiresAt) {
            await OTP.deleteOne({ _id: otpDoc._id });
            return NextResponse.json({ message: "This code has expired. Please request a new one." }, { status: 400 });
        }

        if (otpDoc.code !== otp.trim()) {
            return NextResponse.json({ message: "Incorrect code. Please try again." }, { status: 400 });
        }

        // Mark OTP as used
        await OTP.updateOne({ _id: otpDoc._id }, { used: true });

        // Create the actual user
        const newUser = await User.create({
            name: otpDoc.userData?.name,
            email,
            passwordHash: otpDoc.userData?.passwordHash,
            language: otpDoc.userData?.language || "english",
            isEmailVerified: true,
        });

        return NextResponse.json({
            message: "Email verified! Account created successfully.",
            userId: newUser._id,
        }, { status: 201 });

    } catch (error) {
        console.error("OTP verification error:", error);
        return NextResponse.json({ message: "Verification failed. Please try again." }, { status: 500 });
    }
}
