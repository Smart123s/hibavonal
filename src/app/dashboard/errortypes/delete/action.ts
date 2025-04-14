"use server"
import { prisma } from "@/prisma";
console.log("ok");
export async function deleteRoomAction(id: string) {
  try {
    const room = await prisma.errorType.findUnique({
      where: { id },
    });

    if (!room) {
      return null;
    }

    const deletedRoom = await prisma.errorType.delete({
      where: { id },
    });

    return deletedRoom;
  } catch (error) {
    console.error("Error during room deletion:", error);
    throw new Error("Error deleting room");
  }
}
