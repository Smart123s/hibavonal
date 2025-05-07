"use server";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { hasPermission } from "@/utils/permissions";
import { prisma } from "@/prisma";

export async function deleteRoomAction(id: string) {
  try {
    const session = await auth();
    
  
    const role = session?.user?.role;
    if (!session?.user || !role || !hasPermission(session.user.role as Role, "room", "delete")) {
      throw new Error("You do not have permission to delete rooms.");
    }

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new Error("Room not found.");
    }

    const deletedRoom = await prisma.room.delete({
      where: { id },
    });

    return deletedRoom;
  } catch (error: unknown) {
      const message =
      error instanceof Error ? error.message : 'Something went wrong during deletion';
  
    alert(message);
  }
}
