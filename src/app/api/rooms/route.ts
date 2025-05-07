// src/app/api/rooms/route.ts
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Prisma, Role } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let queryRestrictions: Prisma.RoomWhereInput = {};

  switch (session.user.role) {
    case Role.admin:
    case Role.leadMaintainer:
    case Role.maintainer:
      break;

    case Role.student:
      queryRestrictions = {
        users: {
          some: {
            id: session.user.id,
          },
        },
      };
      break;

    default:
      return NextResponse.json(
        { error: "Room query restrictions not implemented for this role." },
        { status: 403 }
      );
  }

  const rooms = await prisma.room.findMany({
    where: queryRestrictions,
  });

  return NextResponse.json({ rooms, role: session.user.role });
}
