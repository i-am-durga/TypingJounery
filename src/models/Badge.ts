import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBadge extends Document {
    userId: mongoose.Types.ObjectId;
    badgeId: string; // E.g., "first-lesson", "speed-demon-80"
    earnedAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    badgeId: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
});

export const Badge: Model<IBadge> = mongoose.models.Badge || mongoose.model<IBadge>("Badge", BadgeSchema);
