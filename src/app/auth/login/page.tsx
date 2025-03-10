"use client";

import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { startTransition, useActionState, useEffect } from "react";
import { authenticate, AuthState } from "./actions";
import { redirect } from "next/navigation";
import {DevLoginButton} from "@/components/DevLoginButton";

export default function LoginPage() {
  const [state, action] = useActionState<AuthState | null, FormData>(
    authenticate,
    null
  );
  const { status, update } = useSession();

  React.useEffect(() => {
    if (state?.success) {
      update().then(() => {
        redirect("/");
      });
    } else if (state?.errors && Object.keys(state.errors).length > 0) {
      showNotification({
        title: "Login Error",
        message: `Login failed: ${state?.errors?.credentials?.join(", ")}`,
        color: "red",
      });
    }
  }, [state, update]);

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/");
    }
  }, [status]);

  // workaround to keep form data after submitting it
  // useful when form has errors and user needs to fix them
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">HibaVonal</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Link href="/auth/signup">
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Text ta="center">Developer Tab</Text>
        <DevLoginButton handleSubmit={handleSubmit} role="student" />
        <DevLoginButton handleSubmit={handleSubmit} role="maintainer" />
        <DevLoginButton handleSubmit={handleSubmit} role="leadMaintainer" />
        <DevLoginButton handleSubmit={handleSubmit} role="admin" />
      </Paper>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            name="email"
            label="Email"
            placeholder="you@mantine.dev"
            required
            error={state?.errors?.email}
          />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            error={state?.errors?.credentials}
          />
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
