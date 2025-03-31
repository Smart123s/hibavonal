"use client";

import RedirectButton from "@/app/components/redirectButton";
import {
  Button,
  Container,
  Text,
  Textarea,
  TextInput,
  Alert, NativeSelect,
} from "@mantine/core";
import {useActionState, useEffect, useState} from "react";
import {createTicketAction, loadRooms, RoomOption, TicketState} from "./action";
import { showNotification } from "@mantine/notifications";
import { redirect } from "next/navigation";

export default function NewTicketPage() {
  const [result, action] = useActionState<TicketState | null, FormData>(
    createTicketAction,
    null
  );
  const errors = result?.errors;

  useEffect(() => {
    if (result?.success) {
      showNotification({
        title: "Ticket Created",
        message: `Ticket ${result.data?.title} created successfully`,
        color: "teal",
      });
      redirect("/dashboard/tickets");
    }
  }, [result]);

  const [roomOptions, setRoomOptions] = useState<RoomOption[] | null>(null);

  useEffect(() => {
    loadRooms().then(options => setRoomOptions(options))
  }, []);

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
        <RedirectButton url="/dashboard/tickets">Back</RedirectButton>
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
        <NativeSelect label="Room" name="room" withAsterisk data={roomOptions !== null ? roomOptions : ['Loading...']} disabled={roomOptions === null} />
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
        <Button type="submit" mt="md" disabled={roomOptions === null}>
          {roomOptions === null ? "Loading..." : "Submit"}
        </Button>{" "}
      </form>
    </div>
  );
}
