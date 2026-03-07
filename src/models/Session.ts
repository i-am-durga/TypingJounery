import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    lessonId?: string;
    wpm: number;
    accuracy: number;
    duration: number; // in seconds
    language: string;
    completedAt: Date;
    mistakeKeys: string[];
}

const SessionSchema = new Schema<ISession>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lessonId: { type: String },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    duration: { type: Number, required: true },
    language: { type: String, default: "english" },
    completedAt: { type: Date, default: Date.now },
    mistakeKeys: [{ type: String }],
});

export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
