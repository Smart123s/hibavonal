"use server";
import {Button, Card, Container, Text, Textarea, TextInput} from "@mantine/core";
import {prisma} from "@/prisma";
import RedirectButton from "@/app/components/redirectButton";
import {save} from "@/app/dashboard/tickets/[id]/edit/action";

export default async function EditTicketPage(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const p = await params;

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

  if(!ticket.type?.allowsEditing) return (
    <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
      <Text>Ticket cannot be edited.</Text>
      <RedirectButton url={`/dashboard/tickets/${p.id}`} w="min-content" mt="md">Back</RedirectButton>
    </Card>
  );

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
          Edit ticket
        </Text>
        <RedirectButton url={`/dashboard/tickets/${p.id}`}>Back</RedirectButton>
      </Container>
      <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
        <form action={save}>
          <input type="hidden" name="id" defaultValue={p.id} readOnly />
          <TextInput
            label="Title"
            name="title"
            required
            defaultValue={ticket.title}
          />
          <Textarea
            label="Description"
            name="description"
            required
            defaultValue={ticket.description}
            mt="sm"
          />
          <Button type="submit" mt="xl">
            Save
          </Button>
        </form>
      </Card>
    </>
  );
}
