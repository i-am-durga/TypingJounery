"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Keyboard, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Learning Path", href: "/path" },
        { name: "Practice", href: "/practice" },
        { name: "Leaderboard", href: "/leaderboard" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy/80 backdrop-blur-lg">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                        <Keyboard className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-wide neon-text-primary">
                        TypeFlow
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-gray-400"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                        <Button variant="ghost" className="hover:bg-white/5 hover:text-white" asChild>
                            <Link href="/login" className="flex items-center gap-2">
                                <LogIn className="w-4 h-4" />
                                <span>Log In</span>
                            </Link>
                        </Button>
                        <Button className="bg-primary hover:bg-primary-hover text-navy font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all hover:scale-105" asChild>
                            <Link href="/signup">Sign Up Free</Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10 bg-navy-light px-4 py-6 flex flex-col gap-4 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`text-base font-medium p-3 rounded-lg transition-colors ${pathname === link.href ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                        <Button variant="outline" className="w-full justify-center border-white/20 hover:bg-white/5" asChild>
                            <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                        </Button>
                        <Button className="w-full justify-center bg-primary hover:bg-primary-hover text-navy font-bold" asChild>
                            <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up Free</Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
