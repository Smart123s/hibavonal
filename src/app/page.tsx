import { auth } from "@/auth";
import { Button } from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
