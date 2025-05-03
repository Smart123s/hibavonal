"use client";

import RedirectButton from "@/app/components/redirectButton";
import {
  Button,
  Container,
  Text,
  TextInput,
  Alert,
  NativeSelect,
} from "@mantine/core";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { redirect } from "next/navigation";
import { RoomType } from "@prisma/client";

export default function NewRoomPage() {
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const roomTypeOptions = Object.values(RoomType).map((type) => ({
    label: type,
    value: type,
  }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      level: parseInt(formData.get("level") as string),
      roomType: formData.get("roomType"),
    };

    const res = await fetch("/api/rooms/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      setErrors(result.errors || { _form: ["Unknown error"] });
      return;
    }

    showNotification({
      title: "Room Created",
      message: `Room ${result.data.name} created successfully`,
      color: "teal",
    });

    redirect("/dashboard/roommanagement");
  };

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
          Create new room
        </Text>
        <RedirectButton url="/dashboard/roommanagement">Back</RedirectButton>
      </Container>

      {errors && Object.values(errors).length > 0 && (
        <Alert color="red" mb="md" title="Error creating room">
          {Object.entries(errors).map(([key, messages], index) => (
            <div key={index}>
              {messages.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          ))}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Room Name"
          placeholder="Enter room name"
          name="name"
          required
          error={errors?.name?.[0]}
        />
        <TextInput
          label="Level"
          placeholder="Enter room level"
          name="level"
          required
          type="number"
          error={errors?.level?.[0]}
        />
        <NativeSelect
          label="Room Type"
          name="roomType"
          required
          data={roomTypeOptions}
          error={errors?.roomType?.[0]}
        />
        <Button type="submit" mt="md">
          Submit
        </Button>
      </form>
    </div>
  );
}
