"use client";

import { useEffect, useState } from "react";
import RedirectButton from "@/app/components/redirectButton";
import {
  Badge,
  Card,
  Group,
  Text,
  Grid,
  GridCol,
  Container,
} from "@mantine/core";
import { Role } from "@prisma/client";
import { hasPermission } from "@/utils/permissions";

type ErrorType = {
  id: string;
  name: string;
  severity: number;
};

export default function HomePage() {
  const [errorTypes, setErrorTypes] = useState<ErrorType[]>([]);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    async function fetchErrorTypes() {
      const res = await fetch("/api/errortypes");
      if (res.ok) {
        const data = await res.json();
        setErrorTypes(data.errorTypes);
        setRole(data.role);
      } else {
        console.error("Failed to fetch error types");
      }
    }

    fetchErrorTypes();
  }, []);

  return (
    <div>
      <Container
        fluid
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "space-between",
          marginBottom: "16px",
        }}
      >
        <Text fw={700} size="xl">
          Error types
        </Text>
        {role && hasPermission(role, "errortype", "create") && (
          <RedirectButton url="/dashboard/errortypes/new/">
            Create new error type
          </RedirectButton>
        )}
      </Container>
      <Grid>
        {errorTypes.map((errorType) => (
          <GridCol span={{ base: 12, md: 6, lg: 3 }} key={errorType.id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{errorType.name}</Text>
                <Badge color="red" autoContrast>
                  Severity: {errorType.severity}
                </Badge>
              </Group>

              <RedirectButton
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                url={`/dashboard/errortypes/${errorType.id}`}
              >
                View details
              </RedirectButton>

              {role && hasPermission(role, "errortype", "delete") && (
                <RedirectButton
                  color="red"
                  url={`/dashboard/errortypes/delete?id=${errorType.id}`}
                >
                  Delete
                </RedirectButton>
              )}
            </Card>
          </GridCol>
        ))}
      </Grid>
    </div>
  );
}