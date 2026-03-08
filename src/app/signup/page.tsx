"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<"form" | "otp">("form");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        language: "english"
    });
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    language: formData.language
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
            } else {
                setStep("otp");
                startResendCooldown();
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
        }
    };

    const startResendCooldown = () => {
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    language: formData.language
                }),
            });
            if (res.ok) {
                setSuccess("New code sent!");
                setOtp(["", "", "", "", "", ""]);
                startResendCooldown();
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch {
            setError("Failed to resend code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp: otpCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Verification failed");
            } else {
                setSuccess("Account created! Signing you in...");
                await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });
                router.push("/dashboard");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <AuthLayout
            title={step === "form" ? "Start Your Journey" : "Verify Your Email"}
            subtitle={
                step === "form"
                    ? "Create an account to track your progress and earn badges."
                    : `We sent a 6-digit code to ${formData.email}`
            }
        >
            <AnimatePresence mode="wait">
                {step === "form" ? (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-start gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                                <Input id="name" name="name" placeholder="John Doe"
                                    className="bg-navy/80 border-white/5 text-white h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                                    value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language" className="text-gray-300">Language</Label>
                                <select id="language" name="language"
                                    className="flex h-12 w-full rounded-xl border border-white/5 bg-navy/80 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300 cursor-pointer"
                                    value={formData.language} onChange={handleChange}>
                                    <option value="english">English</option>
                                    <option value="hindi">Hindi</option>
                                    <option value="nepali">Nepali</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com"
                                className="bg-navy/80 border-white/5 text-white h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                                value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Min. 8 chars"
                                    className="bg-navy/80 border-white/5 text-white h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                                    value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password"
                                    className="bg-navy/80 border-white/5 text-white h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                                    value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div>

                        <Button type="submit"
                            className="w-full bg-primary hover:bg-primary-hover text-navy font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 mt-6"
                            disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Sending code...</span>
                            ) : "Continue with Email →"}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-navy-light px-2 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <Button type="button" variant="outline"
                            className="w-full h-12 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-white transition-all duration-300 backdrop-blur-sm"
                            onClick={handleGoogleLogin}>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </Button>

                        <p className="mt-4 text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                        </p>
                    </motion.form>
                ) : (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mx-auto mb-6">
                            <Mail className="w-7 h-7 text-primary" />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-start gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> {success}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <Label className="text-gray-300 text-sm block mb-3 text-center">Enter your 6-digit code</Label>
                                <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => { otpRefs.current[i] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(i, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                            className="w-12 h-14 text-center text-xl font-bold font-mono bg-navy border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(0,229,255,0.25)] transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button type="submit"
                                className="w-full bg-primary hover:bg-primary-hover text-navy font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300"
                                disabled={isLoading || otp.join("").length !== 6}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</span>
                                ) : "Verify & Create Account"}
                            </Button>

                            <div className="text-center space-y-3">
                                <button type="button" onClick={handleResendOTP}
                                    disabled={resendCooldown > 0 || isLoading}
                                    className="text-sm text-gray-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't get it? Resend code"}
                                </button>
                                <div>
                                    <button type="button" onClick={() => { setStep("form"); setError(""); setOtp(["", "", "", "", "", ""]); }}
                                        className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1 mx-auto">
                                        <ArrowLeft className="w-3 h-3" /> Change email
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthLayout>
    );
}
