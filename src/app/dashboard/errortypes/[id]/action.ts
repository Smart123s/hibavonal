"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";

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
      error: "Unauthorized",
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
      error: "Error type not found",
    };
  }

  return {
    loaded: true,
    errorType,
  };
}

export async function updateErrorData(id: string, data: { name: string; severity: number }) {
  const existing = await prisma.errorType.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Error type not found");
  }

  const updated = await prisma.errorType.update({
    where: { id },
    data: {
      name: data.name,
      severity: data.severity,
    },
  });

  return updated;
}
