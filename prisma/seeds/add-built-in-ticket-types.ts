import {Seeder} from "./main";
import {prisma} from "../../src/prisma";

export enum TicketType {
    SentIn = "sent-in",
    InProgress = "in-progress",
    Done = "done",
    Feedback = "feedback",
    Rejected = "rejected"
}

const addBuiltInTicketTypes: Seeder = {
    async up() {
        await prisma.ticketType.createMany({
            data: [
                {
                    id: TicketType.SentIn,
                    builtIn: true,
                    name: "Beküldve",
                    color: "#175dc5",
                    allowsCommenting: true
                },
                {
                    id: TicketType.InProgress,
                    builtIn: true,
                    name: "Folyamatban",
                    color: "#17bfc5",
                    allowsCommenting: true
                },
                {
                    id: TicketType.Done,
                    builtIn: true,
                    name: "Kész",
                    color: "#34C517",
                    allowsCommenting: true
                },
                {
                    id: TicketType.Feedback,
                    builtIn: true,
                    name: "Visszajelzés",
                    color: "#FC7910",
                    allowsCommenting: true
                },
                {
                    id: TicketType.Rejected,
                    builtIn: true,
                    name: "Elutasítva",
                    color: "#EC0E0E",
                    allowsCommenting: false
                }
            ]
        })
    },
    async down() {
        await prisma.ticketType.deleteMany({
            where: {
                id: {
                    in: [
                        TicketType.SentIn,
                        TicketType.InProgress,
                        TicketType.Done,
                        TicketType.Feedback,
                        TicketType.Rejected
                    ]
                }
            }
        })
    }

}

export default addBuiltInTicketTypes;
