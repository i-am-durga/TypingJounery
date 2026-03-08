import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { OTP } from "@/models/OTP";
import { sendOTPEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimiter";
import { sanitize } from "@/lib/sanitizer";

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Step 1: Send OTP to email
export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "anonymous";
        const { success } = rateLimit(ip, 5, 60000); // 5 requests per minute

        if (!success) {
            return NextResponse.json({ message: "Too many requests. Please try again in a minute." }, { status: 429 });
        }

        const body = await req.json();
        const name = sanitize(body.name);
        const email = sanitize(body.email);
        const password = body.password;
        const language = body.language;

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
        }

        // Hash password upfront — store in OTP doc, create user only after OTP is verified
        const passwordHash = await bcrypt.hash(password, 12);

        // Delete any existing OTPs for this email
        await OTP.deleteMany({ email, purpose: "verify" });

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await OTP.create({
            email,
            code: otpCode,
            purpose: "verify",
            expiresAt,
            userData: {
                name,
                passwordHash,
                language: language || "english",
            },
        });

        await sendOTPEmail(email, otpCode, name);

        return NextResponse.json({
            message: "OTP sent to your email. Please verify to complete registration.",
            step: "verify-otp",
        }, { status: 200 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Failed to send verification email. Please try again." }, { status: 500 });
    }
}
