"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import {isDevEmail} from "../../../../prisma/seeds/add-dev-users";

export async function signUp(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password) {
        throw new Error("Missing required fields");
    }

    if(isDevEmail(email)) {
        throw new Error("This email domain is not allowed");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
