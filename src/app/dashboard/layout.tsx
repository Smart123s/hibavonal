"use client";
import { useSession } from "next-auth/react";

import SignOutButton from "@/components/signoutButton";
import {
  AppShell,
  Burger,
  AppShellHeader,
  Group,
  AppShellNavbar,
  AppShellMain,
  Text,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [activeNav, setActiveNav] = useState("");
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }
  }, [status]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveNav(window.location.pathname.split("/")[2]);
    }
  }, []);

  const linksData = ["Home", "Tickets"];

  const links = linksData.map((link) => (
    <NavLink
      href={`/dashboard/${link.toLowerCase()}`}
      label={link}
      active={activeNav === link.toLowerCase()}
      onClick={() => setActiveNav(link.toLowerCase())}
      key={link}
      component={Link}
    />
  ));

  return (
    <div>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShellHeader>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl">HibaVonal</Text>
            <div style={{ marginLeft: "auto" }}>
              <SignOutButton />
            </div>
          </Group>
        </AppShellHeader>
        <AppShellNavbar p="md">{links}</AppShellNavbar>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </div>
  );
}
