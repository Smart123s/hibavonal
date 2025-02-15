"use client";

import SignOutButton from "@/components/signoutButton";
import {
  AppShell,
  Burger,
  AppShellHeader,
  Group,
  Skeleton,
  AppShellNavbar,
  AppShellMain,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

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
        <AppShellNavbar p="md">
          Navbar
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShellNavbar>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </div>
  );
}
