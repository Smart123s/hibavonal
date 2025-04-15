const permissions = {
    student: {
        ticket: {
            create: true,
            read: true,
        },
        ticketComment: {},
        room: {
            create: false,
            delete: false,
            edit:   false,
        },
        errortype: {
            create: false,
            delete: false,
            edit:   false,
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
            edit:   false,
        },
        errortype: {
            create: false,
            delete: false,
            edit:   false,
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
            edit:   true,
        },
        errortype: {
            create: false,
            delete: false,
            edit:   false,
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
            edit:   true,
        },
        errortype: {
            create: true,
            delete: true,
            edit:   true,
        },
    } as RolePermissions,
};

interface Permission {
    create?: boolean;
    read?: boolean;
    readAll?: boolean;
    delete?: boolean;
    edit?: boolean;
}

interface RolePermissions {
    ticket: Permission;
    ticketComment: Permission;
    room: Permission;
    errortype: Permission;
}

export function hasPermission(role: keyof typeof permissions, resource: keyof RolePermissions, permission: keyof Permission) {
    return permissions[role][resource][permission] ?? false;
}
