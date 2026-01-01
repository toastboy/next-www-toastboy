import { Button, Group, Stack, Text, Title } from '@mantine/core';

/**
 * Renders a not-found message with navigation options back to informational or
 * home pages.
 */
export default function NotFound() {
    return (
        <Stack gap="md">
            <Title order={2}>Page not found</Title>
            <Text>
                The page you&apos;re looking for doesn&apos;t exist or has moved.
            </Text>
            <Group>
                <Button component="a" href="/footy/info">
                    Go to info
                </Button>
                <Button variant="subtle" component="a" href="/footy">
                    Go to home
                </Button>
            </Group>
        </Stack>
    );
}
