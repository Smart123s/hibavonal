import {Role} from "@prisma/client";

const permissions: {
    [k in Role]: RolePermissions
} = {
    student: {
        ticket: {
            create: true,
            readAll: false,
            editAll: false,
            assignAll: false,
            readAssignedUser: false,
        },
        ticketComment: {
            createForAny: true
        },
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
            create: false,
            readAll: false,
            editAll: false,
            assignAll: false,
            readAssignedUser: false,
        },
        ticketComment: {
            createForAny: true
        },
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
            create: false,
            readAll: true,
            editAll: false,
            assignAll: true,
            readAssignedUser: true
        },
        ticketComment: {
            createForAny: true,
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
            readAll: true,
            editAll: true,
            assignAll: true,
            readAssignedUser: true,
        },
        ticketComment: {
            createForAny: true,
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
type Permissions = typeof permissions;


interface RolePermissions {
    ticket: {
        create: boolean,
        readAll: boolean,
        editAll: boolean,
        assignAll: boolean,
        readAssignedUser: boolean
    },
    ticketComment: {
        createForAny: boolean
    },
    room: {
        create: boolean,
        delete: boolean,
        edit: boolean
    },
    errortype: {
        create: boolean,
        delete: boolean,
        edit: boolean
    }
}

export function hasPermission<
    SRole extends keyof Permissions,
    SResource extends keyof Permissions[SRole],
    SPermission extends keyof Permissions[SRole][SResource]
>(
    roleName: SRole,
    resourceName: SResource,
    permissionName: SPermission
): boolean {
    return permissions[roleName][resourceName][permissionName] as boolean;
}
