const permissions = {
    student: {
        ticket: {
            create: true,
            read: true,
        },
        ticketComment: {},
        room: {
            create: false,
        },
    } as RolePermissions,
    maintainer: {
        ticket: {
            create: true,
            read: true,
        },
        ticketComment: {},
        room: {
            create: false,
            delete: false,
        },
    } as RolePermissions,
    leadMaintainer: {
        ticket: {
            create: true,
            read: true,
            readAll: true,
        },
        ticketComment: {
            create: true,
        },
        room: {
            create: true,
            delete: true,
        },
    } as RolePermissions,
    admin: {
        ticket: {
            create: true,
            read: true,
            readAll: true,
        },
        ticketComment: {
            create: true,
        },
        room: {
            create: true,
            delete: true,
        },
    } as RolePermissions,
};

interface Permission {
    create?: boolean;
    read?: boolean;
    readAll?: boolean;
}

interface RolePermissions {
    ticket: Permission;
    ticketComment: Permission;
    room: Permission;
}

export function hasPermission(role: keyof typeof permissions, resource: keyof RolePermissions, permission: keyof Permission) {
    return permissions[role][resource][permission] ?? false;
}
