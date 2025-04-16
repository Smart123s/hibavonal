'use server';

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { hasPermission } from "@/utils/permissions";
import { Role, Room, RoomType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(1, { message: "Room name is required" }),
    level: z.number().min(1, { message: "Level is required" }),
    roomType: z.string().min(1, { message: "Room type is required" }),
});

export interface RoomState {
    errors?: Record<string, string[]>;
    success?: boolean;
    data?: Room;
}

export async function createRoomAction(prevState: RoomState | null, formData: FormData) {
    const validatedFields = schema.safeParse({
        name: formData.get('name'),
        level: parseInt(formData.get('level')),
        roomType: formData.get('roomType'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, level, roomType } = validatedFields.data;

    const session = await auth();
    if (!session || !session.user) {
        return {
            errors: { _form: ["Unauthorized"] },
        };
    }

    if (!hasPermission(session.user.role as Role, 'room', 'create')) {
        return {
            errors: { _form: ["You don't have permission to create a room."] },
        };
    }

    let room;
    try {
        room = await prisma.room.create({
            data: {
                name,
                level,
                roomType: roomType as RoomType, 
                users: {
                    connect: { id: session.user.id },
                },
            },
        });
    } catch (e: Error | unknown) {
        console.error("Database Error:", e ?? 'Error is null');
        return {
            errors: { _form: ["Failed to create room."] },
        };
    }

    revalidatePath('/dashboard/rooms');

    return {
        success: true,
        data: room,
    };
}
