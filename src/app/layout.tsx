import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { StackProvider, StackTheme } from "@stackframe/stack";
import CustomAppShell from 'components/CustomAppShell/CustomAppShell';
import type { Metadata } from 'next';
import { stackServerApp } from "../stack";

import { MantineProvider } from '@mantine/core';

import './globals.css';

export const metadata: Metadata = {
  title: "Toastboy FC",
  description: "Toastboy FC: five-a-side footy on Tuesdays at Kelsey Kerridge, Cambridge",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <MantineProvider>
              <CustomAppShell>
                {children}
              </CustomAppShell>
            </MantineProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
