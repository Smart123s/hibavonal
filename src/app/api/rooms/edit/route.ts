import defineRoute from "@omer-x/next-openapi-route-handler";
import { z } from "zod";
import { updateRoomData } from "@/app/dashboard/roomaction/edit/action";

export const { POST } = defineRoute({
  operationId: "updateRoom",
  method: "POST",
  summary: "Update room information",
  description: "Update name, level, type, and assigned students of a room",
  tags: ["Rooms"],
  requestBody: z.object({
    id: z.string().min(1, { message: "Room ID is required" }),
    name: z.string().min(1, { message: "Room name is required" }),
    level: z.number().int().min(1, { message: "Room level is required" }),
    roomType: z.string().min(1, { message: "Room type is required" }),
    assignedStudents: z.array(z.string()),
  }),
  action: async ({ body }) => {
    try {
      const { id, ...roomData } = body;
      const updatedRoom = await updateRoomData(id, roomData);

      return Response.json(
        { success: true, data: updatedRoom },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error updating room:", error.message || error);

      return Response.json(
        { success: false, error: error.message || "Internal server error" },
        {
          status: error.message?.includes("permission")
            ? 403
            : error.message?.includes("Room not found")
            ? 404
            : 500,
        }
      );
    }
  },
  responses: {
    200: { description: "Room updated successfully", content: "" },
    400: { description: "Invalid request body" },
    403: { description: "Permission denied" },
    404: { description: "Room not found" },
    500: { description: "Internal server error" },
  },
  handleErrors: (errorType) => {
    switch (errorType) {
      case "UNKNOWN_ERROR":
        return Response.json(
          { success: false, error: "Internal server error" },
          { status: 500 }
        );
      default:
        return Response.json(
          { success: false, error: "Bad request" },
          { status: 400 }
        );
    }
  },
});
