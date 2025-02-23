import { createTicketAction, TicketState } from "@/app/dashboard/tickets/new/action";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Ticket } from "@prisma/client";

export async function GET(): Promise<Response> {
    try {
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
    } catch (error) {
        return Response.json(
            { errors: { _form: ["Failed to retrieve tickets."] } },
            { status: 500 }
        );
    }
}

export async function POST(request: Request): Promise<Response> {
    try {
        const formData = await request.formData();
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
    } catch (error) {
        return Response.json(
            { errors: { _form: ["Failed to create ticket."] } },
            { status: 500 }
        );
    }
}