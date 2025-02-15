"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";

export async function signUp(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password) {
        throw new Error("Missing required fields");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
            },
        });

        console.log("User created successfully");
    } catch (error) {
        console.error("Signup error:", error);
        throw new Error("Failed to create user");
    } finally {
        redirect("/");
    }
}
