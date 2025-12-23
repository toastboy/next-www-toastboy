import '@mantine/code-highlight/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Metadata } from 'next';

import { CustomAppShell } from '@/components/CustomAppShell/CustomAppShell';
import { getCurrentUser } from '@/lib/authServer';

// Default to dynamic rendering for all pages
// https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering
export const dynamic = "force-dynamic";
export const revalidate = 0; // belt-and-braces; disables ISR on this segment

export const metadata: Metadata = {
    title: "Toastboy FC",
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

    return (
        <html lang="en">
            <body>
                <MantineProvider>
                    <Notifications />
                    {/* <BreakpointDebugger /> */}
                    <CustomAppShell user={user}>
                        {children}
                    </CustomAppShell>
                </MantineProvider>
            </body>
        </html>
    );
}
