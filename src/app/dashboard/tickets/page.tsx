import RedirectButton from "@/app/components/redirectButton";
import {auth} from "@/auth";
import {prisma} from "@/prisma";
import {hasPermission} from "@/utils/permissions";
import {
  Badge,
  Card,
  Group,
  Text,
  Grid,
  GridCol,
  Container,
} from "@mantine/core";
import { Role, Prisma } from "@prisma/client";

export default async function HomePage() {
  const session = await auth();

  let queryRestrictions: Prisma.TicketWhereInput = {};
  switch (session?.user.role) {
    case Role.admin:
    case Role.leadMaintainer:
      break;
    case Role.maintainer:
      queryRestrictions = {
        assignedUserId: session?.user.id,
      }
      break;
    case Role.student:
      queryRestrictions = {
        userId: session?.user.id,
      }
      break;
    default:
      throw new Error("Ticket query restrictions not implemented for this role.")
  }

  const tickets = await prisma.ticket.findMany({
    where: queryRestrictions,
    include: {type: true, room: true}
  });

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
          Tickets
        </Text>
        {hasPermission(session?.user.role as Role, "ticket", "create") && (
          <RedirectButton url="/dashboard/tickets/new/">
            Create new ticket
          </RedirectButton>
        )}
      </Container>
      <Grid>
        {tickets.map((ticket) => (
          <GridCol span={{base: 12, md: 6, lg: 3}} key={ticket.id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{ticket.title}</Text>
                <Group>
                  {ticket.room !== null ? (
                    <Badge
                      color="gray"
                    >
                      {ticket.room?.name}
                    </Badge>
                  ) : null}
                  {ticket.type !== null ? (
                    <Badge
                      color={ticket.type.color}
                      autoContrast
                    >
                      {ticket.type.name}
                    </Badge>
                  ) : null}
                </Group>
              </Group>
              <Text size="sm" c="dimmed">
                Placeholder description text
              </Text>
              <RedirectButton
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                url={"/dashboard/tickets/" + ticket.id}
              >
                View ticket
              </RedirectButton>
            </Card>
          </GridCol>
        ))}
      </Grid>
    </div>
  );
}
