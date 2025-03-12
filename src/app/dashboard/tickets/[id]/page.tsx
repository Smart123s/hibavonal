import {auth} from "@/auth";
import {prisma} from "@/prisma";
import {Card, Text, Badge} from "@mantine/core";
import {loremIpsum} from "lorem-ipsum";

export default async function ViewTicketPage(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const session = await auth();

  const ticket = await prisma.ticket.findUnique({
    where: {id: (await params).id},
    include: {type: true}
  });

  if (!ticket) {
    return <h1>Ticket not found</h1>;
  }

  if (ticket.userId !== session?.user?.id) {
    return <h1>Unauthorized</h1>;
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <div
        style={{display: "flex", alignItems: "center", marginBottom: "1rem"}}
      >
        <Text size="lg" style={{marginRight: "1rem"}}>
          {ticket.title}
        </Text>
        {ticket.type !== null ? (
          <Badge color={ticket.type.color} autoContrast>
            {ticket.type.name}
          </Badge>
        ) : null}
      </div>
      <Text size="sm" c="dimmed">
        {ticket.description}
      </Text>
      {[...Array(4)].map((_, index) => (
        <div key={index}>
          <br/>
          <Text size="sm" c="dimmed">
            {loremIpsum({
              count: 40,
              units: "words",
            })}
          </Text>
        </div>
      ))}
    </Card>
  );
}
