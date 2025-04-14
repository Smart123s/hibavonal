"use server";

import { prisma } from "@/prisma";
import { z } from "zod";

const errorTypeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  severity: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Severity must be a number" })
    .transform(Number)
    .refine((num) => num >= 1 && num <= 10, {
      message: "Severity must be between 1 and 10",
    }),
});

export type ErrorTypeState =
  | {
      success: true;
      data: {
        id: string;
        name: string;
        severity: number;
      };
      errors: null;
    }
  | {
      success: false;
      data: null;
      errors: {
        [key: string]: string;
      };
    };

export async function createErrorTypeAction(
  prevState: ErrorTypeState | null,
  formData: FormData
): Promise<ErrorTypeState> {
  const formInput = {
    name: formData.get("name") as string,
    severity: formData.get("severity") as string,
  };

  const parsed = errorTypeSchema.safeParse(formInput);

  if (!parsed.success) {
    const errors: { [key: string]: string } = {};
    parsed.error.errors.forEach((err) => {
      if (err.path[0]) {
        errors[err.path[0] as string] = err.message;
      }
    });
    return { success: false, data: null, errors };
  }

  const { name, severity } = parsed.data;

  const newErrorType = await prisma.errorType.create({
    data: {
      name,
      severity,
    },
  });

  return {
    success: true,
    data: {
      id: newErrorType.id,
      name: newErrorType.name,
      severity: newErrorType.severity,
    },
    errors: null,
  };
}
