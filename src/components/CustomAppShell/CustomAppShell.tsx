'use client';

import { AppShell, Badge, Burger, Container, Group, Image, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { NavBarNested } from '@/components/NavBarNested/NavBarNested';
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
 */
export const CustomAppShell = ({ children, user, devMode }: Props) => {
    const [opened, { toggle, close }] = useDisclosure();
    const pathname = usePathname();

    useEffect(() => {
        close();
    }, [pathname, close]);

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
                <Container fluid p="xl">
                    {children}
                </Container>
            </AppShell.Main>

        </AppShell>
    );
};
