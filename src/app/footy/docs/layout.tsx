import { Box } from '@mantine/core';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Box py="xl">{children}</Box>;
}
