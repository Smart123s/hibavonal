"use server";
import { Role } from "@prisma/client";
import { prisma } from "@/prisma";
import { z } from "zod";
import { auth } from "@/auth"; 
import { hasPermission } from "@/utils/permissions";


const errorTypeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  severity: z
    .number()
    .min(1, { message: "Severity must be at least 1" })
    .max(10, { message: "Severity must be at most 10" }),
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
    type CreateErrorTypeFormInput = {
      name: string;
      severity: number;
    };

export async function createErrorTypeAction(
  prevState: ErrorTypeState | null,
  formData: CreateErrorTypeFormInput 

): Promise<ErrorTypeState> {
  const formInput = formData;


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

  const session = await auth();
  console.log("Session:", session);

  if (!session?.user || !hasPermission(session.user.role as Role, "errortype", "create")) {
    return {
      success: false,
      data: null,
      errors: { general: "You do not have permission to create error types." },
    };
  }

  try {
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
  } catch (error) {
    console.error("Error creating error type:", error);
    return {
      success: false,
      data: null,
      errors: { general: "Server error" },
    };
  }
}
