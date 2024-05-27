'use client';

import { AppShell, Burger, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NavbarNested from 'components/NavBarNested/NavBarNested';
import Image from 'next/image';

interface CustomAppShellProps {
    children: React.ReactNode;
}

const CustomAppShell: React.FC<CustomAppShellProps> = ({ children }: CustomAppShellProps) => {
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
                <div>
                    <Group justify="space-between">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
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
                <Container fluid p="xl">
                    {children}
                </Container>
            </AppShell.Main>
        </AppShell>
    );
};

export default CustomAppShell;
