import {Button} from "@mantine/core";
import React, {FormEventHandler} from "react";
import {Role} from "@prisma/client";
import {roleToHumanReadable} from "@/utils/roles";
import {getDevEmailFromRole} from "../../prisma/seeds/add-dev-users";

export function DevLoginButton(
    { handleSubmit, role }: {
        handleSubmit: FormEventHandler<HTMLFormElement>,
        role: Role
    }) {
    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="email" value={getDevEmailFromRole(role)} />
            <input type="hidden" name="password" value="-" />
            <Button type="submit" fullWidth mt="md">
                Sign in as {roleToHumanReadable(role)}
            </Button>
        </form>
    );
}