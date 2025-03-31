'use server';

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { hasPermission } from "@/utils/permissions";
import { Role, Ticket } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {TicketType} from "../../../../../prisma/seeds/add-built-in-ticket-types";

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    room: z.string().min(1, { message: "Room is required" }),
    description: z.string().min(1, { message: "Description is required" }),
});

export interface TicketState {
    errors?: Record<string, string[]>;
    success?: boolean;
    data?: Ticket;
}

export async function createTicketAction(prevState: TicketState | null, formData: FormData) {
    const validatedFields = schema.safeParse({
        title: formData.get('title'),
        room: formData.get('room'),
        description: formData.get('description'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { title, room, description } = validatedFields.data;

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

    if(!(await prisma.room.findFirst({
        where: {
            id: room,
            users: {
                some: {
                    id: session.user.id
                }
            }
        }
    }))) {
        return {
            errors: { _form: ["Room does not belong to user"] },
        }
    }

    console.log({
        title,
        description,
        typeId: TicketType.SentIn,
        userId: session.user.id as string,
        roomId: room
    })

    let ticket;
    try {
        ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                typeId: TicketType.SentIn,
                userId: session.user.id as string,
                roomId: room
            },
        });
    } catch (e: Error | unknown) {
        console.error("Database Error:", e ?? 'Error is null');
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

export type RoomOption = {
    label: string;
    value: string;
}

export async function loadRooms(): Promise<RoomOption[]> {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const result = await prisma.user.findFirst({
        where: {
            id: session.user.id,
        },
        select: {
            rooms: true
        }
    })
    if(result === null) throw new Error("Missing user");

    return result.rooms.map(room => {
        return {
            label: `${room.name} (Floor ${room.level})`,
            value: room.id
        }
    })
}
