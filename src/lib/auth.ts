import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async signIn() {
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                await connectDB();
                const dbUser = await User.findById(user.id);
                if (dbUser && dbUser.avatar) {
                    token.picture = dbUser.avatar;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                Object.assign(session.user, { id: token.id });
                if (token.picture) {
                    session.user.image = token.picture as string;
                }
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 Days persistence
        updateAge: 24 * 60 * 60, // Update JWT every 24 hours to prolong
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};
