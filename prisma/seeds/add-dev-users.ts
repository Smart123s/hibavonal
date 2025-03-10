import {Seeder} from "./main";
import {prisma} from "../../src/prisma";
import {Role} from "@prisma/client";

export function getDevEmailFromRole(role: Role) {
    return `${role}@example.com`
}

const addDevUsers: Seeder = {
    async up() {
        await prisma.user.createMany({
            data: [
                {
                    name: 'Test Student',
                    email: getDevEmailFromRole('student'),
                    emailVerified: new Date(),
                    role: 'student',
                    createdAt: new Date(),
                },
                {
                    name: 'Test Maintainer',
                    email: getDevEmailFromRole('maintainer'),
                    emailVerified: new Date(),
                    role: 'maintainer',
                    createdAt: new Date(),
                },
                {
                    name: 'Test Lead Maintainer',
                    email: getDevEmailFromRole('leadMaintainer'),
                    emailVerified: new Date(),
                    role: 'leadMaintainer',
                    createdAt: new Date(),
                },
                {
                    name: 'Test Admin',
                    email: getDevEmailFromRole('admin'),
                    emailVerified: new Date(),
                    role: 'admin',
                    createdAt: new Date(),
                },
            ]
        })
    },
    async down() {
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [
                        getDevEmailFromRole('student'),
                        getDevEmailFromRole('maintainer'),
                        getDevEmailFromRole('leadMaintainer'),
                        getDevEmailFromRole('admin')
                    ],
                }
            }
        })
    },
}
export default addDevUsers;