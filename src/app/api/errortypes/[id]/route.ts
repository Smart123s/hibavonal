import defineRoute from "@omer-x/next-openapi-route-handler";
import { updateErrorData } from "@/app/dashboard/errortypes/[id]/action";
import { z } from "zod";
import { auth } from "@/auth";

export const { PUT } = defineRoute({
  operationId: "updateErrorType",
  method: "PUT",
  summary: "Update an existing error type",
  description: "Update the name and severity of an existing error type by ID",
  tags: ["ErrorTypes"],
  requestParams: z.object({
    id: z.string().min(1, { message: "ID is required" }),
  }),
  requestBody: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    severity: z
      .number()
      .min(1, { message: "Severity must be at least 1" })
      .max(10, { message: "Severity must be at most 10" }),
  }),
  action: async ({ params, body }) => {
    const session = await auth();
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    try {
      const updated = await updateErrorData(params.id, body);
      return Response.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
      console.error("Update error:", error);

      return new Response(
        JSON.stringify({ error: error.message || "Server error" }),
        { status: error.message === "Error type not found" ? 404 : 500 }
      );
    }
  },
  responses: {
    200: { description: "Error type updated successfully", content: "" },
    400: { description: "Invalid input" },
    401: { description: "Unauthorized" },
    404: { description: "Error type not found" },
    500: { description: "Server error" },
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