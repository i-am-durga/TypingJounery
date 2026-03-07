import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOTP extends Document {
    email: string;
    code: string;
    purpose: "verify" | "reset";
    expiresAt: Date;
    used: boolean;
    userData?: {
        name: string;
        passwordHash: string;
        language: string;
    };
}

const OTPSchema = new Schema<IOTP>({
    email: { type: String, required: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ["verify", "reset"], required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
    userData: {
        name: { type: String },
        passwordHash: { type: String },
        language: { type: String },
    },
});

// Auto-expire documents from MongoDB after expiry
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP: Model<IOTP> = mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);
