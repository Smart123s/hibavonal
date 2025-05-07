"use client";
import {ActionIcon, Badge, Card, Container, Group, Loader, Text, Textarea} from "@mantine/core";
import {loremIpsum} from "lorem-ipsum";
import {roleToHumanReadable} from "@/utils/roles";
import React, {startTransition, useActionState, useEffect, useRef, useState} from "react";
import {CommentSendState, loadTicketData, sendComment, TicketData} from "@/app/dashboard/tickets/[id]/action";
import { IconSend } from "@tabler/icons-react"
import RedirectButton from "@/app/components/redirectButton";

export default function ViewTicketPage(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const p = React.use(params);

  const [data, setData] = useState<TicketData>({
    loaded: false
  })

  const [, action] = useActionState<CommentSendState | null, FormData>(
    sendComment,
    null
  );

  const commentForm = useRef<HTMLFormElement>(null);

  function handleSendComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(!data.loaded) return;
    const formData = new FormData(event.currentTarget);
    formData.set("ticketId", data.ticket?.id ?? "");
    startTransition(
      () =>  {
        action(formData);
        commentForm.current?.reset();
        loadTicketData(p.id).then(d => setData(d));
      }
    );
  }

  useEffect(() => {
    console.log("Hello")
    loadTicketData(p.id).then(d => setData(d));
  }, [p.id])

  return (
    <div>
        {!data.loaded ? (
          <Group w="100%" h="50vh" display="flex" justify="center" align="center">
            <Loader color="blue" type="bars" />
          </Group>
        ) : (
          <>
            <Container
              fluid
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "end",
                marginBottom: "16px",
              }}
            >

              
              {data.ticket && !data.canEdit  ? (
                <RedirectButton url={`/dashboard/tickets/${p.id}/edit`}>Edit</RedirectButton>
              ) : null}
              {data.ticket && data.canAssignToMaintainer ? (
                <Container m={0} fluid style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--mantine-spacing-md)"
                }}>
                  {data.ticket && data.ticket.assignedUser ? (
                    <Text>Assigned to {data.ticket.assignedUser.name} ({data.ticket.assignedUser.email})</Text>
                  ) : null}
                  <RedirectButton url={`/dashboard/tickets/${p.id}/assign`}>{data.ticket.assignedUser == null ? "Assign" : "Reassign"}</RedirectButton>
                </Container>
              ) : null}
            </Container>
            <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
              {data.ticket ? (
                <>
                  <div
                    style={{display: "flex", alignItems: "center", marginBottom: "1rem"}}
                  >
                    <Text size="lg" style={{marginRight: "1rem"}}>
                      {data.ticket.title}
                    </Text>
                    <Group>
                      {data.ticket.room !== null ? (
                        <Badge
                          color="gray"
                        >
                          {data.ticket.room?.name}
                        </Badge>
                      ) : null}
                      {data.ticket.type !== null ? (
                        <Badge color={data.ticket.type.color} autoContrast>
                          {data.ticket.type.name}
                        </Badge>
                      ) : null}
                    </Group>
                  </div>
                  <Text size="sm" c="dimmed">
                    {data.ticket.description}
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
                </>
              ) : (
                <Text>{ data.error }</Text>
              )}
            </Card>
            <hr style={{ color: "var(--mantine-color-dark-4)" }}/>
            {data.ticket ? (
              <div style={{ marginTop: "var(--mantine-spacing-md)" }}>
                {data.ticket.comments.map((comment, i) => (
                  <div style={{ display: "contents" }} key={comment.id}>
                    {(i === 0 || data.ticket.comments[i - 1].userId !== comment.userId) ? (
                      <Group mb="md" mr="auto">
                        <Text>
                          {comment.user.name}
                        </Text>
                        <Badge color={comment.user.id == data.userId ? "blue" : "gray"} autoContrast>
                          {roleToHumanReadable(comment.user.role)}
                        </Badge>
                      </Group>
                    ) : null}
                    <Card
                      shadow="sm"
                      padding="sm"
                      radius="lg"
                      ml={comment.user.id == data.userId ? undefined : "auto"}
                      maw="40rem"
                      w="fit-content"
                      style={{
                        borderTopLeftRadius: (
                          comment.userId === data.userId &&
                          i != 0 &&
                          data.ticket.comments[i - 1].userId === comment.userId
                        ) ? "0" : "var(--mantine-radius-lg)",
                        borderBottomLeftRadius: (
                          comment.userId === data.userId &&
                          data.ticket.comments.length != i + 1 &&
                          data.ticket.comments[i + 1].userId === comment.userId
                        ) ? "0" : "var(--mantine-radius-lg)",
                        borderTopRightRadius: (
                          comment.userId !== data.userId &&
                          i != 0 &&
                          data.ticket.comments[i - 1].userId === comment.userId
                        ) ? "0" : "var(--mantine-radius-lg)",
                        borderBottomRightRadius: (
                          comment.userId !== data.userId &&
                          data.ticket.comments.length != i + 1 &&
                          data.ticket.comments[i + 1].userId === comment.userId
                        ) ? "0" : "var(--mantine-radius-lg)",
                      }}
                      mb={(data.ticket.comments.length != i + 1 && data.ticket.comments[i + 1].userId === comment.userId) ? "2px" : "md"}
                      key={comment.id}
                    >
                      <Text size="sm" c="dimmed">
                        {comment.content}
                      </Text>
                    </Card>
                  </div>
                ))}
                {data.canSubmitComment ? (
                  <form onSubmit={handleSendComment} ref={commentForm}>
                    <Group display="flex" justify="stretch">
                      <Textarea
                        name="content"
                        placeholder="Write your comment here..."
                        radius="lg"
                        style={{ flexGrow: 9 }}
                        maxLength={4096}
                        rightSection={
                          <ActionIcon
                            variant="filled"
                            size="input-md"
                            radius="lg"
                            mr="lg"
                            aria-label="Send comment"
                            type="submit"
                          >
                            <IconSend style={{ width: '70%', height: '70%' }} stroke={1.5} />
                          </ActionIcon>
                        }
                      />
                    </Group>
                    <input type="hidden" name="ticketId" value={data.ticket.id} />
                  </form>
                ) : null}
              </div>
            ) : null}
          </>
        )}
    </div>
  );
}
