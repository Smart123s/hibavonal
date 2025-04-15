import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { deleteRoomAction } from "@/app/dashboard/errortypes/delete/action";
import defineRoute from "@omer-x/next-openapi-route-handler";
import { z } from "zod";

export const { DELETE } = defineRoute({
  operationId: "deleteErrorType",
  method: "DELETE",
  summary: "Delete an error type",
  description: "Deletes a specific error type by ID",
  tags: ["Error Types"],
  requestBody: z.object({
    id: z.string().min(1, { message: "ID is required" }),
  }),
  action: async ({ body }) => {
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const deletedRoom = await deleteRoomAction(id);

    if (!deletedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  },
  responses: {
    200: { description: "Error type deleted successfully", content: "" },
    400: { description: "Bad request, missing ID" },
    404: { description: "Error type not found" },
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
