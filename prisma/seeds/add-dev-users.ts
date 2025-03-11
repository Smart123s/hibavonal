import {Seeder} from "./main";
import {prisma} from "../../src/prisma";
import {Role} from "@prisma/client";

const DEV_EMAIL_DOMAIN = "23977f5b-7ba2-416d-977f-5b7ba2f16d38.example.com"

export function isDevEmail(email: string) {
    return email.endsWith(`@${DEV_EMAIL_DOMAIN}`)
}
export function getDevEmailFromRole(role: Role) {
    return `${role}@${DEV_EMAIL_DOMAIN}`
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