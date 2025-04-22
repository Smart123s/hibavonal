"use server";

import { auth } from "@/auth";
import { hasPermission } from "@/utils/permissions";
import { PrismaClient, Role } from '@prisma/client';

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

export async function updateRoomData(id: string, roomData: any) {
  const { name, level, roomType, assignedStudents } = roomData;

  // Ensure the user has permission to edit room data
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "room", "edit")) {
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
