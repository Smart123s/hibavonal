"use server";

import {auth} from "@/auth";
import {prisma} from "@/prisma";
import {Prisma, Role} from "@prisma/client";
import {z} from "zod";
import {hasPermission} from "@/utils/permissions";
import {TicketPolicy} from "@/utils/policy";

export type TicketData = {
    loaded: false
} | {
    loaded: true,
    canSubmitComment: boolean,
    canEdit: boolean,
    canAssignToMaintainer: boolean,
    ticket: Prisma.TicketGetPayload<{
        select: {
            id: true,
            userId: true,
            title: true,
            description: true,
            type: true,
            room: true,
            assignedUser: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            role: true,
                            name: true
                        }
                    }
                }
            }
        }
    }>,
    userId: string
} | {
    loaded: true,
    ticket: null,
    error: string
};

export async function loadTicketData(id: string): Promise<TicketData> {
    const session = await auth();

    if (!session || !session.user) {
        return {
            loaded: true,
            ticket: null,
            error: "Unauthorized",
        };
    }

    const ticket =  await prisma.ticket.findUnique({
        where: {id},
        select: {
            id: true,
            userId: true,
            title: true,
            description: true,
            type: true,
            room: true,
            assignedUser: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            comments: {
                select: {
                    id: true,
                    content: true,
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            role: true,
                            name: true
                        }
                    }
                }
            }
        },
        /*include: {
            type: true,
            room: true,
            assignedUser: true,
            comments: {
                include: {
                    user: true
                }
            }
        }*/
    });

    if (!ticket) {
        return {
            loaded: true,
            ticket: null,
            error: "Ticket not found",
        };
    }

    if (ticket.userId !== session?.user?.id && !hasPermission(session.user.role as Role, 'ticketComment', 'createForAny')) {
        return {
            loaded: true,
            ticket: null,
            error: "Unauthorized",
        };
    }

    return {
        loaded: true,
        ticket,
        canSubmitComment: TicketPolicy.canSubmitComment(ticket, session.user),
        canEdit: TicketPolicy.canEdit(ticket, session.user),
        canAssignToMaintainer: TicketPolicy.canAssignToMaintainer(ticket, session.user),
        userId: session?.user?.id
    }
}

const commentSchema = z.object({
    ticketId: z.string().min(1, { message: "Ticket ID is required" }),
    content: z.string()
        .min(1, { message: 'Comment is required' })
        .max(4096, { message: 'Comment may not be longer than 4096 characters.' }),
})

export type CommentSendState = {
    success: true
} | {
    success: false,
    errors: Record<string, string[]>
}

export async function sendComment(
    prevState: CommentSendState | null,
    formData: FormData
): Promise<CommentSendState> {
    const validated = commentSchema.safeParse({
        content: formData.get("content"),
        ticketId: formData.get("ticketId")
    })

    if(!validated.success) {
        return {
            success: false,
            errors: validated.error.flatten().fieldErrors
        }
    }

    const session = await auth();

    if (!session || !session.user) {
        return {
            success: false,
            errors: { _form: ["Unauthorized"] },
        };
    }

    const ticket = await prisma.ticket.findFirst({
        where: {
            id: validated.data.ticketId,
        },
        include: {
            type: true
        }
    })

    if(ticket == null) {
        return {
            success: false,
            errors: { _form: ["Ticket not found"] },
        }
    }

    if (
        ticket.userId !== session.user.id &&
        ticket.assignedUserId !== session.user.id &&
        !hasPermission(session.user.role as Role, 'ticketComment', 'createForAny')
    ) {
        return {
            success: false,
            errors: { _form: ["Unauthorized"] },
        }
    }

    if(!ticket.type?.allowsCommenting) {
        return {
            success: false,
            errors: { _form: ["Comments are not allowed"] },
        }
    }

    await prisma.ticketComment.create({
        data: {
            content: validated.data.content,
            user: {
                connect: {
                    id: session?.user?.id,
                }
            },
            ticket: {
                connect: {
                    id: validated.data.ticketId,
                }
            }
        }
    })

    return {
        success: true
    }
}
