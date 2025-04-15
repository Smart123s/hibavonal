import { NextRequest, NextResponse } from "next/server";
import { createErrorTypeAction } from "@/app/dashboard/errortypes/new/action";
import { z } from "zod";


const errorTypeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  severity: z
    .number()
    .min(1, { message: "Severity must be at least 1" })
    .max(10, { message: "Severity must be at most 10" }),
});

export const POST = async (req: NextRequest) => {
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


    const result = await createErrorTypeAction(null, body);

    if (!result.success) {
      return NextResponse.json({ success: false, data: null, errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      errors: null,
    });
  } catch (error) {
    console.error("Error handling the request:", error);
    return NextResponse.json(
      { success: false, data: null, errors: { general: "Internal server error" } },
      { status: 500 }
    );
  }
};
