"use server";

import {z} from "zod";
import {prisma} from "@/prisma";
import {Role} from "@prisma/client";
import {redirect} from "next/navigation";

const schema = z.object({
    id: z.string(),
    maintainer: z.string()
})

export async function save(formData: FormData) {
    const validatedFields = schema.safeParse({
        id: formData.get("id"),
        maintainer: formData.get("maintainer"),
    })

    if(!validatedFields.success) {
        throw new Error("Field requirements not met: " + JSON.stringify(validatedFields.error.flatten().fieldErrors));
    }

    /*const ticket = await prisma.ticket.findFirstOrThrow({
        where: {
            id: validatedFields.data.id
        },
        include: {
            type: true
        }
    });*/

    // Ensure passed ID is of a maintainer
    if(await prisma.user.count({
        where: {
            role: Role.maintainer,
            id: validatedFields.data.maintainer
        }
    }) === 0) {
        throw new Error("User does not exist or is not a maintainer")
    }

    await prisma.ticket.update({
        where: {
            id: validatedFields.data.id,
        },
        data: {
            assignedUserId: validatedFields.data.maintainer
        }
    })

    redirect(`/dashboard/tickets/${validatedFields.data.id}`);
}
