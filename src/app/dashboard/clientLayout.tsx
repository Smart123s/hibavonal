"use client";

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
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [activeNav, setActiveNav] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
    setActiveNav(pathname.split("/")[2] || "home");
  }, [pathname]);

  const linksData = ["Home", "Tickets","RoomManagement","Errortypes"];

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
