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
  Stack,
} from "@mantine/core";
import { Role } from "@prisma/client";
import { hasPermission } from "@/utils/permissions";
type Room = {
  id: string;
  name: string;
  level?: string;
};
export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    async function loadRooms() {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms);
        setRole(data.role);
      } else {
        console.error("Failed to fetch rooms");
      }
    }

    loadRooms();
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
        <Text fw={700} size="xl">Rooms</Text>
      </Container>
      <Grid>
        {rooms.map((room) => (
          <GridCol span={{ base: 12, md: 6, lg: 3 }} key={room.id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{room.name}</Text>
              </Group>
              <Text size="sm" c="dimmed">
                {room.level ?? "Ground Floor"}
              </Text>
              {role && hasPermission(role, "room", "delete") && (
                <Stack mt="md">
                  <RedirectButton
                    color="blue"
                    fullWidth
                    radius="md"
                    url={`/dashboard/roomaction/edit?id=${room.id}`}
                  >
                    View Room
                  </RedirectButton>
                  <RedirectButton
                    color="red"
                    fullWidth
                    radius="md"
                    url={`/dashboard/roomaction/roomdelete?id=${room.id}`}
                  >
                    Delete Room
                  </RedirectButton>
                </Stack>
              )}
            </Card>
          </GridCol>
        ))}
      </Grid>

      {role && hasPermission(role, "room", "create") && (
        <RedirectButton
          color="green"
          fullWidth
          mt="md"
          radius="md"
          url="/dashboard/roommanagement/new"
        >
          Add New Room
        </RedirectButton>
      )}
    </div>
  );
}