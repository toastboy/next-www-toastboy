'use client';

import { AppShell, Burger, Container, Group, Image, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { AuthUserSummary } from '@/types/AuthUser';

import { NavBarNested } from '../NavBarNested/NavBarNested';

/** Props for the application shell wrapper. */
export interface Props {
    /** Page content rendered inside the shell main area. */
    children: React.ReactNode;
    /** Current signed-in user used to populate navigation affordances. */
    user?: AuthUserSummary | null;
}

/**
 * Renders the persistent site shell with responsive navigation.
 *
 * On small screens the navbar is automatically closed whenever the pathname
 * changes so a newly navigated page starts with the content unobscured.
 */
export const CustomAppShell = ({ children, user }: Props) => {
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
                        <Image
                            src="/crest.jpg"
                            w={56}
                            h={56}
                            fit="contain"
                            alt="Toastboy FC Crest"
                        />
                        <Text>Toastboy FC</Text>
                    </Group>
                </Container>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavBarNested user={user} />
            </AppShell.Navbar>

            <AppShell.Main>
                <Container fluid p="xl">
                    <Suspense>
                        {children}
                    </Suspense>
                </Container>
            </AppShell.Main>

            <AppShell.Footer>
                <Container ta="center">
                    <Text>© 2025 Toastboy FC</Text>
                </Container>
            </AppShell.Footer>

        </AppShell>
    );
};
