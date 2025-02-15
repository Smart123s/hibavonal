import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";

import { Notifications } from "@mantine/notifications";

import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <SessionProvider session={session}>
          <MantineProvider defaultColorScheme="auto">
            <Notifications />
            {children}
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
