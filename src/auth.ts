import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./utils/bcrypt";


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
                    return null;
                }

                const passwordsMatch = await comparePassword(password, user.password);

                if (!passwordsMatch) {
                    return null;
                }

                return user;
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.id as string,
            },
        }),
        jwt({ token, user }) {
            if (user) {
                return { ...token, id: user.id };
            }
            return token;
        },
    },
});
