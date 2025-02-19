"use client";

import { Button } from "@mantine/core";
import { redirect } from "next/navigation";

interface RedirectButtonProps {
  text: string;
  url: string;
}

export default function RedirectButton(props: RedirectButtonProps) {
  return (
    <Button
      onClick={() => {
        redirect(props.url);
      }}
    >
      {props.text}
    </Button>
  );
}
