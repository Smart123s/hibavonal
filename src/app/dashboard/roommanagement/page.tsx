import RedirectButton from "@/app/components/redirectButton";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
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

export default async function HomePage() {
  const session = await auth();
  const rooms = await prisma.room.findMany();

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
          Rooms
        </Text>
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
            </Card>
          </GridCol>
        ))}
      </Grid>

      {/* New Room Button */}
      <RedirectButton
        color="green"
        fullWidth
        mt="md"
        radius="md"
        url="/dashboard/roommanagement/new"
      >
        Add New Room
      </RedirectButton>
    </div>
  );
}
