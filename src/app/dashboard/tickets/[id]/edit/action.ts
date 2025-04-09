"use server";

import {z} from "zod";
import {prisma} from "@/prisma";
import {redirect} from "next/navigation";

const schema = z.object({
    id: z.string(),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
})

export async function save(formData: FormData) {
    const validatedFields = schema.safeParse({
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
    })

    if(!validatedFields.success) {
        throw new Error("Field requirements not met: " + JSON.stringify(validatedFields.error.flatten().fieldErrors));
    }

    const ticket = await prisma.ticket.findFirstOrThrow({
        where: {
            id: validatedFields.data.id
        },
        include: {
            type: true
        }
    });

    if(!ticket.type?.allowsEditing) throw new Error("Ticket cannot be edited.");

    await prisma.ticket.update({
        where: {
            id: validatedFields.data.id,
        },
        data: {
            title: validatedFields.data.title,
            description: validatedFields.data.description,
        }
    });

    redirect(`/dashboard/tickets/${validatedFields.data.id}`);
}
