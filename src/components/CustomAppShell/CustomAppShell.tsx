'use client';

import { AppShell, Burger, Container, Group, Image, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NavbarNested from 'components/NavBarNested/NavBarNested';

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
                <NavbarNested />
            </AppShell.Navbar>

            <AppShell.Main>
                <Container fluid p="xl">
                    {children}
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

export default CustomAppShell;
