"use client";

import RedirectButton from "@/app/components/redirectButton";
import {
  Button,
  Container,
  Text,
  TextInput,
  Alert,
  NumberInput,
} from "@mantine/core";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function NewErrorTypePage() {
  const [name, setName] = useState("");
  const [severity, setSeverity] = useState<number | "">("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await fetch("/api/errortypes/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, severity: Number(severity) }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors(result.errors || {});
        return;
      }

      showNotification({
        title: "Error Type Created",
        message: `Error type "${result.data.name}" created successfully`,
        color: "teal",
      });

      router.push("/dashboard/errortypes");
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ general: "Something went wrong." });
    }
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
          Create new error type
        </Text>
        <RedirectButton url="/dashboard/errortypes">Back</RedirectButton>
      </Container>

      {Object.values(errors).length > 0 && (
        <Alert color="red" mb="md" title="Error creating error type">
          {Object.values(errors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          placeholder="Enter error type name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          error={errors.name}
        />
        <NumberInput
          label="Severity"
          placeholder="Enter severity (1-10)"
          name="severity"
          required
          value={severity}
          onChange={(val) => {
            if (typeof val === "number" || val === "") {
              setSeverity(val);
            } else {
              setSeverity("");
            }
          }}
          error={errors.severity}
        />
        <Button type="submit" mt="md">
          Submit
        </Button>
      </form>
    </div>
  );
}
