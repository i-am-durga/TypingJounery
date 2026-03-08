export interface User {
    id: string;
    name: string;
    email?: string;
    image?: string;
    level: number;
    xp?: number;
    wpm: number;
    accuracy: number;
    unlockedLessons?: string[];
}

export interface LessonNode {
    _id: string;
    level: number;
    order: number;
    title: string;
    targetWPM: number;
    estimatedMinutes: number;
    type: 'practice' | 'tutorial' | 'exam';
}

export interface CompletionData {
    xpEarned: number;
    newBadges: string[];
}

export interface SessionData {
    wpm: number;
    accuracy: number;
    duration: number;
    language: string;
    mistakeKeys: string[];
}
