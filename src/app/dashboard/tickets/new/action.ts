'use server';

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { hasPermission } from "@/utils/permissions";
import { Role, Ticket } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
});

export interface TicketState {
    errors?: Record<string, string[]>;
    success?: boolean;
    data?: Ticket;
}

export async function createTicket(prevState: TicketState | null, formData: FormData) {
    const validatedFields = schema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, description } = validatedFields.data;

    const session = await auth();
    if (!session || !session.user) {
        return {
            errors: { _form: ["Unauthorized"] },
        };
    }

    if (!hasPermission(session.user.role as Role, 'ticket', 'create')) {
        return {
            errors: { _form: ["Forbidden"] },
        };
    }

    let ticket;
    try {
        ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                userId: session.user.id as string,
            },
        });
    } catch (e: Error | unknown) {
        console.error("Database Error:", e);
        return {
            errors: { _form: ["Failed to create ticket."] },
        };
    }

    revalidatePath('/dashboard/tickets');

    return {
        success: true,
        data: ticket,
    };
}
