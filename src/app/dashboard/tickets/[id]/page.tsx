"use client";
import {ActionIcon, Badge, Card, Group, Loader, Text, Textarea} from "@mantine/core";
import {loremIpsum} from "lorem-ipsum";
import {roleToHumanReadable} from "@/utils/roles";
import React, {startTransition, useActionState, useEffect, useRef, useState} from "react";
import {CommentSendState, loadTicketData, sendComment, TicketData} from "@/app/dashboard/tickets/[id]/action";
import { IconSend } from "@tabler/icons-react"

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
  }, [])

  return (
    <div>
        {!data.loaded ? (
          <Group w="100%" h="50vh" display="flex" justify="center" align="center">
            <Loader color="blue" type="bars" />
          </Group>
        ) : (
          <>
            <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
              {data.ticket != null ? (
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
              ) : null}
            </Card>
            <hr style={{ color: "var(--mantine-color-dark-4)" }}/>
            {data.ticket ? (
              <div style={{ marginTop: "var(--mantine-spacing-md)" }} key={data.ticket.id}>
                {data.ticket.comments.map((comment, i) => (
                  <>
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
                  </>
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
