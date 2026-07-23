'use client';

import {
    AppShell,
    Badge,
    Burger,
    Container,
    Group,
    Image,
    Stack,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { NavBarNested } from '@/components/NavBarNested/NavBarNested';
import { InternalError } from '@/lib/errors';
import { AuthUserSummary } from '@/types/AuthUser';

/** Props for the application shell wrapper. */
export interface Props {
    /** Page content rendered inside the shell main area. */
    children: React.ReactNode;
    /** Current signed-in user used to populate navigation affordances. */
    user?: AuthUserSummary | null;
    /** Development mode: e.g. whether outbound email is routed to Mailpit
     * rather than real inboxes. */
    devMode?: boolean;
}

/**
 * Renders the persistent site shell with responsive navigation.
 *
 * On small screens the navbar is automatically closed whenever the pathname
 * changes so a newly navigated page starts with the content unobscured.
 *
 * @throws {InternalError} If the active Mantine theme does not define
 * `other.appShellMaxWidth` / `other.appShellMinWidth` (see `src/theme.ts`) —
 * this indicates the app is rendering without its custom `MantineProvider`
 * theme in place. The detailed diagnostic stays in the error's internal
 * `message`; `publicMessage` carries a short, safe string for display to
 * end users (e.g. via the app's error boundary).
 */
export const CustomAppShell = ({ children, user, devMode }: Props) => {
    const [opened, { toggle, close }] = useDisclosure();
    const pathname = usePathname();
    const theme = useMantineTheme();

    useEffect(() => {
        close();
    }, [pathname, close]);

    const other = theme.other ?? {};

    if (typeof other.appShellMaxWidth !== 'number' || typeof other.appShellMinWidth !== 'number') {
        throw new InternalError(
            'CustomAppShell requires the app theme (other.appShellMaxWidth / other.appShellMinWidth from src/theme.ts) to be provided via MantineProvider.',
            { publicMessage: 'App theme is not configured.' },
        );
    }

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Container>
                    <Group justify="space-between" className="px-6">
                        <Burger
                            aria-label="Toggle navigation"
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Link href="/footy">
                            <Image
                                src="/crest.jpg"
                                w={56}
                                h={56}
                                fit="contain"
                                alt="Toastboy FC Crest"
                            />
                        </Link>
                        <Group gap="xs">
                            <Text>Toastboy FC</Text>
                            {devMode ? (
                                <Badge color="orange" variant="filled" size="sm">
                                    dev mode
                                </Badge>
                            ) : null}
                        </Group>
                    </Group>
                </Container>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavBarNested user={user} />
            </AppShell.Navbar>

            <AppShell.Main>
                <Stack
                    maw={other.appShellMaxWidth}
                    miw={other.appShellMinWidth}
                    m="auto"
                    gap="md"
                    p="xl"
                    align="center"
                >
                    {children}
                </Stack>
            </AppShell.Main>

        </AppShell>
    );
};
