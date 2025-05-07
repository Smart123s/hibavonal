import defineRoute from "@omer-x/next-openapi-route-handler";

import { Role } from "@prisma/client";
import { deleteRoomAction } from "@/app/dashboard/roomaction/roomdelete/action";
import { auth } from "@/auth";
import { hasPermission } from "@/utils/permissions";

export const { DELETE } = defineRoute({
  operationId: "deleteRoom",
  method: "DELETE",
  summary: "Delete a room",
  description: "Deletes a room by ID if it exists.",
  tags: ["Rooms"],


  action: async (source, request) => {
    const { id } = await request.json();

    if (!id || id.trim().length === 0) {
      return Response.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session?.user || !hasPermission(session.user.role as Role, "room", "delete")) {
      return Response.json(
        { error: "You do not have permission to delete rooms." },
        { status: 403 }
      );
    }

    try {
      const deletedRoom = await deleteRoomAction(id);

      if (!deletedRoom) {
        return Response.json({ error: "Room not found" }, { status: 404 });
      }

      return Response.json({ success: true, data: deletedRoom }, { status: 200 });
    } catch (err: unknown) {
      console.error("Error deleting room:", err);
      return Response.json(
        { error: "Internal Server Error while deleting room." },
        { status: 500 }
      );
    }
  },

  responses: {
    200: { description: "Room deleted successfully", content: "" },
    400: { description: "Invalid request parameters" },
    403: { description: "Forbidden" },
    404: { description: "Room not found" },
    500: { description: "Error deleting room" },
  },

  handleErrors: (errorType) => {
    switch (errorType) {
      case "UNKNOWN_ERROR":
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      default:
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }
  },
});
