import "@mantine/code-highlight/styles.css";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import CustomAppShell from 'components/CustomAppShell/CustomAppShell';
import type { Metadata } from 'next';

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
        <MantineProvider>
          <CustomAppShell>
            {children}
          </CustomAppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
