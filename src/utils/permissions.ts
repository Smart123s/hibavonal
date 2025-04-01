const permissions = {
    student: {
        ticket: {
            create: true,
            read: true,
        },
        ticketComment: {}
    } as RolePermissions,
    maintainer: {
        ticket: {
            create: true,
            read: true,
        },
        ticketComment: {}
    } as RolePermissions,
    leadMaintainer: {
        ticket: {
            create: true,
            read: true,
            readAll: true
        },
        ticketComment: {
            create: true
        }
    } as RolePermissions,
    admin: {
        ticket: {
            create: true,
            read: true,
            readAll: true,
        },
        ticketComment: {
            create: true
        }
    } as RolePermissions,
}

interface Permission {
    create?: boolean
    read?: boolean
    readAll?: boolean
}

interface RolePermissions {
    ticket: Permission,
    ticketComment: Permission
}

export function hasPermission(role: keyof typeof permissions, resource: keyof RolePermissions, permission: keyof Permission) {
    return permissions[role][resource][permission] ?? false;
}
