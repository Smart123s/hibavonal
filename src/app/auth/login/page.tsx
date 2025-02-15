"use client";

import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useActionState, useEffect } from "react";
import { authenticate, AuthState } from "./actions";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [state, formAction] = useActionState<AuthState | null, FormData>(
    authenticate,
    null
  );
  const { data: session, status, update } = useSession();

  React.useEffect(() => {
    if (state?.success) {
      update().then(() => {
        redirect("/");
      });
    } else if (state?.error) {
      showNotification({
        title: "Login Error",
        message: `Login failed: ${state?.error}`,
        color: "red",
      });
    }
  }, [state]);

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/");
    }
  }, [status]);

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Link href="/auth/signup">
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={formAction}>
          <TextInput
            name="email"
            label="Email"
            placeholder="you@mantine.dev"
            required
          />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
