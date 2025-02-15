import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },

    providers: [
        Credentials({
            async authorize(credentials) {
                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) {
                    throw new CredentialsSignin("Invalid email or password.");
                }

                const passwordsMatch = await bcrypt.compare(password, user?.password as string);

                if (!passwordsMatch) {
                    throw new Error("Invalid email or password.");
                }

                return user;
            },
        }),
    ],
});
