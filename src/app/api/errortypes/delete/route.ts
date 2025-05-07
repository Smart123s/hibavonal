import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { deleteRoomAction } from "@/app/dashboard/errortypes/delete/action";
import defineRoute from "@omer-x/next-openapi-route-handler";
import { z } from "zod";

export const { DELETE } = defineRoute({
  operationId: "deleteRoom",
  method: "DELETE",
  summary: "Deletes a room by ID if it exists.",
  description: "Deletes a room by ID if it exists.",
  tags: ["Rooms"],

  queryParams: z.object({
    id: z.string().min(1, { message: "Room ID is required" }),
  }),

  action: async (source, request) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id || id.trim().length === 0) {
      return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }

    const deletedRoom = await deleteRoomAction(id);

    if (!deletedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  },

  responses: {
    200: { description: "Room deleted successfully", content: "" },
    400: { description: "Bad request, missing ID" },
    404: { description: "Room not found" },
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
