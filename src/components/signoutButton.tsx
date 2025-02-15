"use client";

import { Button } from "@mantine/core";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

const handleSignOut = async () => {
  await signOut({
    redirect: false,
  });
  redirect("/auth/login");
};

export default function SignOutButton() {
  return <Button onClick={handleSignOut}>Sign out</Button>;
}
