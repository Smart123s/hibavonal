import RedirectButton from "@/app/components/redirectButton";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import {hasPermission} from "@/utils/permissions";
import {Role,Prisma} from "@prisma/client";
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

  ///
  let queryRestrictions: Prisma.RoomWhereInput = {};

  switch (session?.user.role) {
    case Role.admin:
    case Role.leadMaintainer:
    case Role.maintainer:
      break;
  
    case Role.student:
      queryRestrictions = {
        users: {
          some: {
            id: session.user.id,
          },
        },
      };
      break;
  
    default:
      throw new Error("Room query restrictions not implemented for this role.");
  }
    const rooms = await prisma.room.findMany({where: queryRestrictions});
  ////
  //const rooms = await prisma.room.findMany();

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
              {hasPermission(session?.user.role as Role, "room", "delete") && (
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
              </Stack>)}
            </Card>
          </GridCol>
        ))}
      </Grid>

      {hasPermission(session?.user.role as Role, "room", "create") && (
      <RedirectButton
        color="green"
        fullWidth
        mt="md"
        radius="md"
        url="/dashboard/roommanagement/new"
      >
        Add New Room
      </RedirectButton>)}
    </div>
  );
}
