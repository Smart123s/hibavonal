"use server";

import {Button, Card, Container, NativeSelect, Text} from "@mantine/core";
import RedirectButton from "@/app/components/redirectButton";
import {prisma} from "@/prisma";
import {Role} from "@prisma/client";
import {save} from "@/app/dashboard/tickets/[id]/assign/action";
import {auth} from "@/auth";
import {TicketPolicy} from "@/utils/policy";

export default async function AssignTicketPage(
  {
    params
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const p = await params;
  const session = await auth();

  const ticket = await prisma.ticket.findFirst({
    where: {
      id: p.id,
    },
    include: {
      type: true
    }
  })

  if(!ticket) return (
    <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
      <Text>Ticket not found.</Text>
      <RedirectButton url="/dashboard/tickets" w="min-content" mt="md">Back</RedirectButton>
    </Card>
  );

  if(!session || !TicketPolicy.canAssignToMaintainer(ticket, session.user)) return (
    <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
      <Text>Ticket cannot be assigned.</Text>
      <RedirectButton url={`/dashboard/tickets/${ticket.id}`} w="min-content" mt="md">Back</RedirectButton>
    </Card>
  )

  const maintainers = (await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      role: Role.maintainer
    }
  })).map(maintainer => {
    return {
      label: `${maintainer.name} (${maintainer.email})`,
      value: maintainer.id
    }
  })

  return (
    <>
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
          {ticket.assignedUserId == null ? "Assign" : "Reassign"} ticket
        </Text>
        <RedirectButton url={`/dashboard/tickets/${p.id}`}>Back</RedirectButton>
      </Container>
      <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
        <form action={save}>
          <input type="hidden" name="id" defaultValue={p.id} readOnly />
          <NativeSelect label="Maintainer" name="maintainer" withAsterisk data={maintainers} defaultValue={ticket.assignedUserId ?? undefined} />
          <Button type="submit" mt="xl">
            Save
          </Button>
        </form>
      </Card>
    </>
  );
}
