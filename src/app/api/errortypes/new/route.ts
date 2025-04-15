import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { z } from "zod";
import defineRoute from "@omer-x/next-openapi-route-handler";

// Define the schema for validating the error type input
const errorTypeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  severity: z
    .number()
    .min(1, "Severity must be at least 1")
    .max(10, "Severity must be at most 10"),
});

export const { POST } = defineRoute({
  operationId: "createErrorType",
  method: "POST",
  summary: "Create a new error type",
  description: "Creates a new error type with name and severity",
  tags: ["Error Types"],
  requestBody: errorTypeSchema,
  action: async ({ body }) => {
    // Parse and validate the input
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

    // Create the new error type in the database
    try {
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
  },
  responses: {
    200: { description: "Error type created successfully", content: "" },
    400: { description: "Bad request, validation error" },
    500: { description: "Internal server error" },
  },
  handleErrors: (errorType) => {
    switch (errorType) {
      case "UNKNOWN_ERROR":
        return new Response(null, { status: 500 });
      default:
        return new Response(null, { status: 400 });
    }
  },
});
