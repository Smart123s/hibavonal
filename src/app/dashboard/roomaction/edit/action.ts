"use server";

import { auth } from "@/auth";
import { hasPermission } from "@/utils/permissions";
import { PrismaClient, Role, RoomType } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchRoomData(id: string) {
  if (!id) {
    console.log('Missing ID in fetchRoomData');
    return null;
  }

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      users: true,
      equipments: { include: { request: true } },
      tickets: true,
    },
  });

  return room;
}

export async function fetchAllStudents() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}
type RoomUpdateInput = {
  name: string;
  level: number;
  roomType: RoomType;
  assignedStudents: string[];
};
export async function updateRoomData(id: string, roomData: RoomUpdateInput) {
  const { name, level, roomType, assignedStudents } = roomData;

  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role as Role, "room", "edit")) {
    throw new Error("You do not have permission to edit rooms.");
  }

  const existingRoom = await prisma.room.findUnique({
    where: { id },
    include: { users: true },
  });

  if (!existingRoom) {
    throw new Error("Room not found");
  }

  const updatedRoom = await prisma.room.update({
    where: { id },
    data: {
      name,
      level,
      roomType,
      users: {
        set: assignedStudents.map((studentId: string) => ({
          id: studentId,
        })),
      },
    },
  });

  return updatedRoom;
}
