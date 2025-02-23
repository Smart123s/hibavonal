import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Ticket } from "@prisma/client";

export async function GET(request: Request): Promise<Response> {
    try {
        const ticketId = request.url.split("/").pop();
        const session = await auth();
        const ticket: Ticket | null = await prisma.ticket.findUnique({
            where: {
                id: ticketId,
                userId: session?.user?.id,
            },
        });

        if (!ticket) {
            return Response.json(
                { errors: { _form: ["Ticket not found."] } },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, data: ticket },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { errors: { _form: ["Failed to retrieve ticket."] } },
            { status: 500 }
        );
    }
}