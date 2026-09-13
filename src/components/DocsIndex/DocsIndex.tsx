'use client';

import { Anchor, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export interface DocLink {
    /** Route the entry links to, e.g. `/footy/docs/privacy`. */
    href: string;
    /** Human-readable document title. */
    title: string;
    /** One-line summary shown beneath the link. */
    description: string;
}

export interface Props {
    /** Documents to list, in the order they should appear. */
    docs: DocLink[];
}

/**
 * Renders the site documentation index: a titled list of links, each with a
 * short description.
 */
export const DocsIndex = ({ docs }: Props) => (
    <Stack gap="lg">
        <Title order={1}>Documentation</Title>
        <Stack gap="md">
            {docs.map((doc) => (
                <Stack
                    key={doc.href}
                    gap={2}
                >
                    <Anchor
                        component={Link}
                        href={doc.href}
                        fw={600}
                    >
                        {doc.title}
                    </Anchor>
                    <Text
                        c="dimmed"
                        size="sm"
                    >
                        {doc.description}
                    </Text>
                </Stack>
            ))}
        </Stack>
    </Stack>
);
