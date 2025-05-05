import {Prisma, Role} from "@prisma/client";
import {User} from "next-auth";
import {hasPermission} from "@/utils/permissions";

export const TicketPolicy = {
    canAssignToMaintainer(ticket: Prisma.TicketGetPayload<{
        select: {
            type: true
        }
    }>, user: User) {
        return (ticket.type?.allowsAssigning ?? false) &&
            hasPermission(user.role as Role, "ticket", "assignAll")
    },
    canEdit(ticket: Prisma.TicketGetPayload<{
        select: {
            userId: true,
            type: true
        }
    }>, user: User) {
        return (ticket.type?.allowsEditing ?? false) &&
            (
                hasPermission(user.role as Role, "ticket", "editAll") ||
                user.id === ticket.userId
            )
    },
    canSubmitComment(ticket: Prisma.TicketGetPayload<{
        select: {
            userId: true,
            type: true
        }
    }>, user: User) {
        return (ticket.type?.allowsCommenting ?? false) &&
            (
                hasPermission(user.role as Role, "ticketComment", "createForAny")
                || user.id === ticket.userId
            )
    }
}
