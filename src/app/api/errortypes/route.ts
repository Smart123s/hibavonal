import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const errorTypes = await prisma.errorType.findMany();

  return NextResponse.json({ errorTypes, role: session.user.role });
}