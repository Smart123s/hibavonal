"use server";
import {Button, Card, Container, Text, Textarea, TextInput, Select} from "@mantine/core";
import {prisma} from "@/prisma";
import RedirectButton from "@/app/components/redirectButton";
import {save} from "@/app/dashboard/tickets/[id]/edit/action";
import {TicketPolicy} from "@/utils/policy";
import {auth} from "@/auth";

export default async function EditTicketPage(
  {
    params,
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
      type: true,
      errorType: true
    }
  })

  if(!ticket) return (
    <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
      <Text>Ticket not found.</Text>
      <RedirectButton url="/dashboard/tickets" w="min-content" mt="md">Back</RedirectButton>
    </Card>
  );

  if(!session || TicketPolicy.canEdit(ticket, session.user)) return (
    <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
      <Text>Ticket cannot be edited.</Text>
      <RedirectButton url={`/dashboard/tickets/${p.id}`} w="min-content" mt="md">Back</RedirectButton>
    </Card>
  )
const errorTypes=await prisma.errorType.findMany();
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
           <Select
            label="Error Type"
            name="errorTypeId"
            data={[
              { value: "", label: "None" },
              ...errorTypes.map(e => ({
                value: e.id,
                label: e.name
              }))
            ]}
            defaultValue={ticket.errorType?.id || ""}
            mt="sm"
            clearable
          />
          <Button type="submit" mt="xl">
            Save
          </Button>
        </form>
      </Card>
    </>
  );
}
