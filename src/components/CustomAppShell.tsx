'use client';

import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavbarNested } from 'components/NavBarNested';
import Image from 'next/image';

export default function CustomAppShell({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

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
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <div>
                    <Group justify="space-between">
                        <Image
                            src="/crest.jpg"
                            width={60}
                            height={60}
                            priority={true}
                            alt="Toastboy FC Crest"
                        />
                        <p>Toastboy FC</p>
                    </Group>
                </div>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavbarNested />
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
