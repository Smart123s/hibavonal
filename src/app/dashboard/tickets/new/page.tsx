"use client";

import RedirectButton from "@/app/components/redirectButton";
import {
  Button,
  Container,
  Text,
  Textarea,
  TextInput,
  Alert,
} from "@mantine/core";
import { useActionState, useEffect } from "react";
import { createTicket } from "./action";
import { showNotification } from "@mantine/notifications";
import { redirect } from "next/navigation";

export default function NewTicketPage() {
  const [result, action] = useActionState(createTicket, { errors: {} });
  const errors = result?.errors;

  useEffect(() => {
    if (result?.success) {
      showNotification({
        title: "Ticket Created",
        message: `Ticket ${result.data.title} created successfully`,
        color: "teal",
      });
      redirect("/dashboard/tickets");
    }
  }, [result]);

  return (
    <div>
      <Container
        fluid
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Text fw={700} size="xl">
          Create new ticket
        </Text>
        <RedirectButton text="Back" url="/dashboard/tickets" />
      </Container>

      {errors && Object.values(errors).length > 0 && (
        <Alert color="red" mb="md" title="Error creating ticket">
          {Object.values(errors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      <form action={action}>
        <TextInput
          label="Title"
          placeholder="Enter ticket title"
          name="title"
          required
          error={errors && "title" in errors ? errors.title : undefined}
        />
        <Textarea
          label="Description"
          placeholder="Enter ticket description"
          name="description"
          required
          autosize
          minRows={3}
          error={
            errors && "description" in errors ? errors.description : undefined
          }
        />
        <Button type="submit" mt="md">
          Submit
        </Button>{" "}
      </form>
    </div>
  );
}
