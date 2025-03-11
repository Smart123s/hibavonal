"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import {prisma} from "@/prisma";
import {DEV_EMAIL_DOMAIN} from "../../../../prisma/seeds/add-dev-users";

export type AuthState = {
    errors?: Record<string, string[]>;
    success?: boolean;
};

const schema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export async function authenticate(
    prevState: AuthState | null,
    formData: FormData
): Promise<AuthState> {
    try {
        const validatedFields = schema.safeParse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { email, password } = validatedFields.data;
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { errors: { credentials: ["Invalid credentials"] } };
                default:
                    return { errors: { unexpected: ["An unexpected error occurred"] } };
            }
        }
        return { errors: { authentication: ["Failed to authenticate"] } };
    }
}

export type DevAccountSeededState = {
    loaded: boolean;
    seeded: boolean;
}

export async function haveDevUsersBeenSeeded(): Promise<DevAccountSeededState> {
    const likeTemplate = `%@${DEV_EMAIL_DOMAIN}`;
    const seededUsersCount =  (await prisma.$queryRaw<[{cnt: number}]>`SELECT COUNT(id) AS cnt FROM User WHERE email LIKE ${likeTemplate}`)[0].cnt;
    return {
        loaded: true,
        seeded: seededUsersCount > 0,
    };
}