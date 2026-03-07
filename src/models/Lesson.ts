import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILesson extends Document {
    level: number; // 1-4
    order: number;
    title: string;
    language: string;
    content: string;
    targetWPM: number;
    estimatedMinutes: number;
    type: string; // e.g., "practice", "challenge"
}

const LessonSchema = new Schema<ILesson>({
    level: { type: Number, required: true },
    order: { type: Number, required: true },
    title: { type: String, required: true },
    language: { type: String, required: true },
    content: { type: String, required: true },
    targetWPM: { type: Number, required: true },
    estimatedMinutes: { type: Number, required: true },
    type: { type: String, default: "practice" },
});

export const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
