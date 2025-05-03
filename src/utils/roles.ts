import {Role} from "@prisma/client";

export function roleToHumanReadable(role: Role, suffix?: string): string {
    return (role.charAt(0).toUpperCase() + role.slice(1)).replace(/([A-Za-z])([A-Z])/, '$1 $2')
        + (suffix ? (" " + suffix.charAt(0).toUpperCase() + suffix.slice(1)) : "");
}
