import { createTicketAction, TicketState } from "@/app/dashboard/tickets/new/action";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Ticket } from "@prisma/client";
import defineRoute from "@omer-x/next-openapi-route-handler";
import { z } from "zod";

export const { GET } = defineRoute({
    operationId: "getTickets",
    method: "GET",
    summary: "Get all tickets for the authenticated user",
    description: "Retrieve all tickets for the authenticated user",
    tags: ["Tickets"],
    action: async () => {
        const session = await auth();
        const tickets: Ticket[] = await prisma.ticket.findMany({
            where: {
                userId: session?.user?.id,
            },
        });

        return Response.json(
            { success: true, data: tickets },
            { status: 200 }
        );
    },
    responses: {
        200: { description: "Tickets retrieved successfully", content: "" },
        500: { description: "Failed to retrieve tickets" },
    },
    handleErrors: (errorType) => {
        switch (errorType) {
            case "UNKNOWN_ERROR":
                return new Response(null, { status: 500 });
            default:
                return new Response(null, { status: 400 });
        }
    }
});

export const { POST } = defineRoute({
    operationId: "createTicket",
    method: "POST",
    summary: "Create a new ticket",
    description: "Create a new ticket for the authenticated user",
    tags: ["Tickets"],
    requestBody: z.object({
        formData: z.object({
            title: z.string().min(1, { message: "Title is required" }),
            description: z.string().min(1, { message: "Description is required" }),
        })
    }),
    action: async ({ body }) => {
        const formData = new FormData();
        formData.append('title', body.formData.title);
        formData.append('description', body.formData.description);
        const result: TicketState = await createTicketAction(null, formData);

        if (result.errors) {
            return Response.json(
                { errors: result.errors },
                { status: 400 }
            );
        }

        return Response.json(
            { success: true, data: result.data },
            { status: 200 }
        );
    },
    responses: {
        200: { description: "Ticket created successfully", content: "" },
        400: { description: "Failed to create ticket" },
        500: { description: "Internal server error" },
    },
    handleErrors: (errorType) => {
        switch (errorType) {
            case "UNKNOWN_ERROR":
                return new Response(null, { status: 500 });
            default:
                return new Response(null, { status: 400 });
        }
    }
});
