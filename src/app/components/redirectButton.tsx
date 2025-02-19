"use client";

import { Button } from "@mantine/core";
import { redirect } from "next/navigation";

import { ButtonProps } from "@mantine/core";

interface RedirectButtonProps extends ButtonProps {
  url: string;
}

export default function RedirectButton({
  url,
  children,
  ...props
}: RedirectButtonProps & { children: React.ReactNode }) {
  return (
    <Button
      onClick={() => {
        redirect(url);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
