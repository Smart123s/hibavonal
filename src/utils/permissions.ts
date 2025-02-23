const permissions = {
    student: {
        ticket: {
            create: true,
            read: true,
        }
    } as RolePermissions,
    maintainer: {
        ticket: {
            create: true,
            read: true,
        }
    } as RolePermissions,
    leadMaintainer: {
        ticket: {
            create: true,
            read: true,
            readAll: true,
        }
    } as RolePermissions,
    admin: {
        ticket: {
            create: true,
            read: true,
            readAll: true,
        }
    } as RolePermissions,
}

interface Permission {
    create?: boolean;
    read?: boolean;
    readAll?: boolean;
}

interface RolePermissions {
    ticket: Permission;
}

export function hasPermission(role: keyof typeof permissions, resource: keyof RolePermissions, permission: keyof Permission) {
    return permissions[role][resource][permission];
}
