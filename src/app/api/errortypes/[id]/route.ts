import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const id = params.id;
  const body = await req.json();

  if (!body.name || typeof body.severity !== "number") {
    return new NextResponse(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }

  try {
    const existing = await prisma.errorType.findUnique({ where: { id } });
    if (!existing) {
      return new NextResponse(JSON.stringify({ error: "Error type not found" }), { status: 404 });
    }

    const updated = await prisma.errorType.update({
      where: { id },
      data: {
        name: body.name,
        severity: body.severity,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return new NextResponse(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
