import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { z } from "zod";

const errorTypeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  severity: z
    .number()
    .min(1, "Severity must be at least 1")
    .max(10, "Severity must be at most 10"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = errorTypeSchema.safeParse(body);
    if (!parsed.success) {
      const errors: { [key: string]: string } = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });

      return NextResponse.json({ success: false, data: null, errors }, { status: 400 });
    }

    const { name, severity } = parsed.data;

    const newErrorType = await prisma.errorType.create({
      data: { name, severity },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newErrorType.id,
        name: newErrorType.name,
        severity: newErrorType.severity,
      },
      errors: null,
    });
  } catch (error) {
    console.error("Error creating error type:", error);
    return NextResponse.json(
      { success: false, data: null, errors: { general: "Server error" } },
      { status: 500 }
    );
  }
}
