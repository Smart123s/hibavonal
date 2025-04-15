"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { hasPermission } from "@/utils/permissions";
import { Role } from "@prisma/client";

export type ErrorTypeData =
  | { loaded: false }
  | {
      loaded: true;
      errorType: {
        id: string;
        name: string;
        severity: number;
      };
    }
  | {
      loaded: true;
      errorType: null;
      error: string;
    };

export async function loadErrorTypeData(id: string): Promise<ErrorTypeData> {
  const session = await auth();

  if (!session?.user) {
    return {
      loaded: true,
      errorType: null,
      error: "You must be logged in to view error types.",
    };
  }

  if (!hasPermission(session.user.role as Role, "errortype", "edit")) {
    return {
      loaded: true,
      errorType: null,
      error: "You do not have permission to view or edit error types.",
    };
  }

  const errorType = await prisma.errorType.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      severity: true,
    },
  });

  if (!errorType) {
    return {
      loaded: true,
      errorType: null,
      error: "Error type not found.",
    };
  }

  return {
    loaded: true,
    errorType,
  };
}

export async function updateErrorData(
  id: string,
  data: { name: string; severity: number }
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "You must be logged in to edit error types." };
  }

  
  if (!hasPermission(session.user.role as Role, "errortype", "edit")) {
    return { success: false, error: "You do not have permission to edit error types." };
  }

  const existing = await prisma.errorType.findUnique({
    where: { id },
  });

  if (!existing) {
    return { success: false, error: "Error type not found." };
  }

  try {
    await prisma.errorType.update({
      where: { id },
      data: {
        name: data.name,
        severity: data.severity,
      },
    });

    return { success: true };
  } catch (e) {
    console.error("Update error:", e);
    return { success: false, error: "An unexpected error occurred while updating." };
  }
}
