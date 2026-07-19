/* eslint-disable simple-import-sort/imports */
// Mantine styles must be imported in this order: https://mantine.dev/styles/mantine-styles/
import '@mantine/core/styles.css';

import '@mantine/code-highlight/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
/* eslint-enable simple-import-sort/imports */

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';

import { Notifications } from '@mantine/notifications';
import type { Metadata } from 'next';

import { CustomAppShell } from '@/components/CustomAppShell/CustomAppShell';
import { getCurrentUser } from '@/lib/auth.server';
import { theme } from '@/theme';

// We used to force dynamic rendering for all pages here:
// https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering
// but this isn't necessary because calling getCurrentUser() already forces
// dynamic rendering for pages that use this layout. For a site of this size and
// complexity, dynamic rendering is probably the right default anyway.

export const metadata: Metadata = {
    title: {
        default: 'Toastboy FC',
        template: '%s | Toastboy FC',
    },
    description: "Toastboy FC: five-a-side footy on Tuesdays at Kelsey Kerridge, Cambridge",
    icons: {
        icon: "/favicon.ico",
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    const devMode = !(process.env.NODE_ENV === 'production' && !process.env.CI);

    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript defaultColorScheme="light" />
            </head>
            <body>
                <MantineProvider theme={theme} defaultColorScheme="light">
                    <Notifications />
                    {/* <DebugBreakpoints /> */}
                    {/* <DebugFontSizes targets={[{ label: 'PlayerLink', selector: '[class*="PlayerLink-module"]' }]} /> */}
                    <CustomAppShell user={user} devMode={devMode}>
                        {children}
                    </CustomAppShell>
                </MantineProvider>
            </body>
        </html>
    );
}
