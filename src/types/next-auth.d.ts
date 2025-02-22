import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            /** The user's postal address. */
            role: string
        } & DefaultSession["user"]
    }

    interface PrismaAdapter {
        createUser: (user: {
            email: string
            name?: string
            image?: string
            role: string
        }) => Promise<Prisma.UserCreateOutputType>
    }
}