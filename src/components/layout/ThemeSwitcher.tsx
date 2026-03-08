"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const themes = [
    { name: "Default (Cyan)", class: "", color: "bg-cyan-500" },
    { name: "Ocean Blue", class: "theme-blue", color: "bg-blue-600" },
    { name: "Emerald Green", class: "theme-green", color: "bg-emerald-500" },
    { name: "Royal Purple", class: "theme-purple", color: "bg-purple-500" },
    { name: "Sunset Orange", class: "theme-orange", color: "bg-orange-500" },
];

export function ThemeSwitcher() {
    const { setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load custom theme color on mount
        const savedColor = localStorage.getItem("typing-journey-color");
        if (savedColor) {
            document.documentElement.classList.add(savedColor);
        }
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // Placeholder to avoid shift
    }

    const setColorTheme = (colorClass: string) => {
        // Remove existing theme classes
        const classes = document.documentElement.className.split(' ');
        classes.forEach(c => {
            if (c.startsWith('theme-')) {
                document.documentElement.classList.remove(c);
            }
        });

        // Add new class
        if (colorClass) {
            document.documentElement.classList.add(colorClass);
        }

        localStorage.setItem("typing-journey-color", colorClass);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full shadow-inner hover:bg-white/10 relative group border border-white/5">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-300" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-navy/90 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <DropdownMenuLabel className="font-bold">Mode</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-white/10">
                    <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-white/10">
                    <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-white/10">
                    <Monitor className="mr-2 h-4 w-4" /> System
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuLabel className="font-bold">Accent Color</DropdownMenuLabel>
                <div className="p-2 flex gap-2 flex-wrap">
                    {themes.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => setColorTheme(t.class)}
                            title={t.name}
                            className={`w-8 h-8 rounded-full ${t.color} border-2 border-transparent hover:scale-110 transition-transform focus:border-white`}
                        />
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
