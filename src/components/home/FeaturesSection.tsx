"use client";

import { motion } from "framer-motion";
import { Target, Zap, Award, Globe, Keyboard, BarChart3 } from "lucide-react";

const features = [
    {
        icon: <Target className="h-6 w-6 text-primary" />,
        title: "Precision Training",
        description: "Focus on problematic keys with our intelligent algorithm that tracks your mistakes and adapts to your weaknesses.",
    },
    {
        icon: <Zap className="h-6 w-6 text-secondary" />,
        title: "Speed Drills",
        description: "Specialized exercises designed to increase your burst speed and muscle memory responsiveness.",
    },
    {
        icon: <Globe className="h-6 w-6 text-blue-400" />,
        title: "Multilingual Support",
        description: "The only platform offering comprehensive typing courses in English, Hindi (Devanagari), and Nepali.",
    },
    {
        icon: <Award className="h-6 w-6 text-primary" />,
        title: "Gamified Learning",
        description: "Earn XP, level up from Beginner to Expert, and unlock exclusive badges to showcase your typing prowess.",
    },
    {
        icon: <Keyboard className="h-6 w-6 text-secondary" />,
        title: "Interactive UI",
        description: "Real-time animated on-screen keyboard showing exact finger placements for perfect touch typing technique.",
    },
    {
        icon: <BarChart3 className="h-6 w-6 text-blue-400" />,
        title: "Advanced Analytics",
        description: "Visualize your progress with detailed charts tracking your WPM, accuracy, and practice consistency over time.",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-background relative border-t border-border">
            <div className="container mx-auto px-4">
                <div className="text-center md:w-2/3 mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
                        The Complete Typing <span className="neon-text-primary text-primary">Dojo</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to master touch typing, beautifully packaged in a futuristic interface that makes learning addictive.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-card/40 backdrop-blur-md border border-border shadow-xl rounded-2xl p-8 group hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-background/5 border border-primary/20 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials / Stats Bar */}
                <div className="mt-24 pt-12 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-4xl font-black text-foreground mb-2">50,000+</div>
                        <div className="text-muted-foreground text-sm uppercase tracking-wider">Active Learners</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-primary mb-2">+35</div>
                        <div className="text-muted-foreground text-sm uppercase tracking-wider">Avg WPM Improvement</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-secondary mb-2">3</div>
                        <div className="text-muted-foreground text-sm uppercase tracking-wider">Supported Languages</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-foreground mb-2">10M+</div>
                        <div className="text-muted-foreground text-sm uppercase tracking-wider">Lessons Completed</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
