import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
    avatar?: string;
    language: string;
    currentLevel: number;
    currentLesson: number;
    totalXP: number;
    streak: number;
    lastPracticeDate?: Date;
    unlockedLessons: string[];
    badges: string[];
    isEmailVerified: boolean;
    isAdmin: boolean;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    language: { type: String, default: "english" },
    currentLevel: { type: Number, default: 1 },
    currentLesson: { type: Number, default: 1 },
    totalXP: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastPracticeDate: { type: Date },
    unlockedLessons: [{ type: String }],
    badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
    isEmailVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
