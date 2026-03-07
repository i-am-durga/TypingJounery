import Link from "next/link";
import { Keyboard, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-navy-dark pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 group mb-4 w-fit">
                            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                                <Keyboard className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-heading font-bold text-xl tracking-wide neon-text-primary">
                                TypeFlow
                            </span>
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Master typing in any language. Increase your words per minute with our futuristic, gamified learning platform.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Learn</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link href="/path" className="text-gray-400 hover:text-primary transition-colors">Learning Path</Link></li>
                            <li><Link href="/practice" className="text-gray-400 hover:text-primary transition-colors">Practice Modes</Link></li>
                            <li><Link href="/languages" className="text-gray-400 hover:text-primary transition-colors">Available Languages</Link></li>
                            <li><Link href="/leaderboard" className="text-gray-400 hover:text-primary transition-colors">Global Leaderboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-4">Legal</h3>
                        <ul className="flex flex-col gap-3">
                            <li><Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {currentYear} TypeFlow (TypingJounery). All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Built with</span>
                        <span className="text-red-500">♥</span>
                        <span>for typing enthusiasts</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
