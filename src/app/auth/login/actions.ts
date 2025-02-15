"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type AuthState = {
    error?: string;
    success?: boolean;
};

export async function authenticate(
    prevState: AuthState | null,
    formData: FormData
): Promise<AuthState> {
    try {
        await signIn("credentials", {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "An unexpected error occurred" };
            }
        }
        return { error: "Failed to authenticate" };
    }
}