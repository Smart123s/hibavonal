"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { hasPermission } from "@/utils/permissions";
import { Role, RoomType } from "@prisma/client";
import defineRoute from "@omer-x/next-openapi-route-handler";
import { z } from "zod";

const roomSchema = z.object({
  name: z.string().min(1, { message: "Room name is required" }),
  level: z
    .number().int()
    .refine((val) => !isNaN(Number(val)), { message: "Level must be a number" })
    .transform(Number),
  roomType: z.string().min(1, { message: "Room type is required" }),
});

export const { POST } = defineRoute({
  operationId: "createRoom",
  method: "POST",
  summary: "Create a new room",
  description: "Creates a new room with the provided details",
  tags: ["Rooms"],
  requestBody: roomSchema,
  action: async ({ body }) => {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json(
        { success: false, errors: { _form: ["Unauthorized"] } },
        { status: 401 }
      );
    }

    if (!hasPermission(session.user.role as Role, "room", "create")) {
      return Response.json(
        {
          success: false,
          errors: { _form: ["You don't have permission to create a room."] },
        },
        { status: 403 }
      );
    }

    const { name, level, roomType } = body;

    try {
      const room = await prisma.room.create({
        data: {
          name,
          level,
          roomType: roomType as RoomType,
          users: {
            connect: { id: session.user.id },
          },
        },
      });

      return Response.json({ success: true, data: room }, { status: 200 });
    } catch (e) {
      console.error("Database Error:", e);
      return Response.json(
        { success: false, errors: { _form: ["Failed to create room."] } },
        { status: 500 }
      );
    }
  },
  responses: {
    200: { description: "Room created successfully" },
    400: { description: "Validation failed" },
    401: { description: "Unauthorized" },
    403: { description: "Forbidden" },
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
