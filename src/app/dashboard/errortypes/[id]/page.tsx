"use client";

import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Text,
  TextInput,
} from "@mantine/core";
import { loadErrorTypeData, updateErrorData, ErrorTypeData } from "./action";

export default function ViewErrorTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = React.use(params);
  const [data, setData] = useState<ErrorTypeData>({ loaded: false });

  const [name, setName] = useState("");
  const [severity, setSeverity] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    loadErrorTypeData(p.id).then((d) => {
      setData(d);
      if (d.loaded && d.errorType) {
        setName(d.errorType.name);
        setSeverity(d.errorType.severity.toString());
      }
    });
  }, []);

  const handleSave = async () => {
    setErrorMessage("");
    try {
      if (!data.loaded || !data.errorType) return;

      const response = await fetch(`/api/errortypes/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.errorType.id,
          name,
          severity: parseInt(severity),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update");
      }

      alert("Error updated successfully!");
    } catch (error: any) {
      console.error("Error updating:", error);
      setErrorMessage(error.message || "Failed to update.");
    }
  };

  if (!data.loaded) {
    return (
      <Group w="100%" h="50vh" justify="center" align="center">
        <Loader color="blue" type="bars" />
      </Group>
    );
  }

  if (data.loaded && data.errorType == null) {
    return (
      <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
        <Text color="red">{data.error}</Text>
      </Card>
    );
  }

  return (
    <div>
      {errorMessage && (
        <Card shadow="sm" padding="md" radius="md" mb="md" withBorder>
          <Text color="red">{errorMessage}</Text>
        </Card>
      )}

      <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          mb="sm"
        />
        <TextInput
          label="Severity"
          type="number"
          value={severity}
          onChange={(e) => setSeverity(e.currentTarget.value)}
          mb="sm"
        />
        <Group justify="end" mt="md">
          <Button onClick={handleSave} className="mt-4">
            Save
          </Button>
        </Group>
      </Card>
    </div>
  );
}
