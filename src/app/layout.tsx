import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import type { Metadata } from 'next';
import CustomAppShell from 'components/CustomAppShell/CustomAppShell';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

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
      <head>
        <ColorSchemeScript />
      </head>
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
