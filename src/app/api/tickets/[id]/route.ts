import { auth } from "@/auth";
import { prisma } from "@/prisma";
import defineRoute from "@omer-x/next-openapi-route-handler";
import { z } from "zod";

export const { GET } = defineRoute({
    operationId: "getTicket",
    method: "GET",
    summary: "Get a specific ticket by ID",
    description: "Retrieve details of a specific ticket by its ID",
    tags: ["Tickets"],
    pathParams: z.object({
        id: z.string().describe("ID of the ticket"),
    }),
    action: async ({ pathParams }) => {
        const session = await auth();
        const ticket = await prisma.ticket.findUnique({
            where: {
                id: pathParams.id,
                userId: session?.user?.id,
            },
        });

        if (!ticket) {
            return new Response("Ticket not found", { status: 404 });
        }

        return Response.json(ticket);
    },
    responses: {
        200: { description: "Ticket details retrieved successfully", content: "" },
        404: { description: "Ticket not found" },
    },
    handleErrors: (errorType) => {
        switch (errorType) {
            case "PARSE_FORM_DATA":
            case "PARSE_REQUEST_BODY":
            case "PARSE_SEARCH_PARAMS":
                return new Response(null, { status: 400 });
            case "PARSE_PATH_PARAMS":
                return new Response(null, { status: 404 });
            case "UNNECESSARY_PATH_PARAMS":
            case "UNKNOWN_ERROR":
                return new Response(null, { status: 500 });
        }
    }
})
