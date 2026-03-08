"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Keyboard, LogIn, Menu, X, User as UserIcon, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

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
                        TypingJounery
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
                        <ThemeSwitcher />

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 border-2 border-transparent hover:border-primary/50 rounded-full transition-all">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                                {session.user?.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-navy/90 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-gray-400">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                                        <Link href="/profile" className="w-full flex items-center">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                                        <Link href="/dashboard" className="w-full flex items-center">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button variant="ghost" className="hover:bg-white/5 hover:text-white" asChild>
                                    <Link href="/login" className="flex items-center gap-2">
                                        <LogIn className="w-4 h-4" />
                                        <span>Log In</span>
                                    </Link>
                                </Button>
                                <Button className="bg-primary hover:bg-primary-hover text-navy font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all hover:scale-105" asChild>
                                    <Link href="/register">Sign Up Free</Link>
                                </Button>
                            </>
                        )}
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
                        {session ? (
                            <>
                                <div className="flex items-center gap-3 p-2 mb-2">
                                    <Avatar className="h-10 w-10 border border-primary/30">
                                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                            {session.user?.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-white">{session.user?.name}</p>
                                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <span className="text-sm text-gray-400">Theme</span>
                                    <ThemeSwitcher />
                                </div>
                                <Button variant="outline" className="w-full justify-center border-white/20 hover:bg-white/5 gap-2" asChild>
                                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                                        <UserIcon className="w-4 h-4" /> Profile
                                    </Link>
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-full justify-center bg-red-500/20 text-red-500 hover:bg-red-500/30 gap-2"
                                    onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <span className="text-sm text-gray-400">Theme</span>
                                    <ThemeSwitcher />
                                </div>
                                <Button variant="outline" className="w-full justify-center border-white/20 hover:bg-white/5" asChild>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                                </Button>
                                <Button className="w-full justify-center bg-primary hover:bg-primary-hover text-navy font-bold" asChild>
                                    <Link href="/register" onClick={() => setIsOpen(false)}>Sign Up Free</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
