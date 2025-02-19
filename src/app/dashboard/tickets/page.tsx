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
} from "@mantine/core";
import { Ticket } from "@prisma/client";

export default async function HomePage() {
  const session = await auth();
  const tickets: Ticket[] = await prisma.ticket.findMany({
    where: {
      userId: session?.user?.id,
    },
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
        <RedirectButton url="/dashboard/tickets/new/">
          Create new ticket
        </RedirectButton>
      </Container>
      <Grid>
        {tickets.map((ticket) => (
          <GridCol span={{ base: 12, md: 6, lg: 3 }} key={ticket.id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>{ticket.title}</Text>
                <Badge color="pink">Status</Badge>
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
