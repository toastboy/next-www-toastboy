'use client';

import type { MantineColor } from '@mantine/core';
import { Anchor, Notification, Stack, Text } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';

export interface Props {
    variant?: 'notification' | 'plain';
    message: ReactNode;
    color?: MantineColor;
    icon?: ReactNode;
    withCloseButton?: boolean;
    anchor?: { href: string; label: string };
}

export const StatusNotification = ({
    variant = 'notification',
    message,
    color,
    icon,
    withCloseButton,
    anchor,
}: Props) => {
    const content =
        variant === 'notification' ? (
            <Notification
                icon={icon}
                color={color}
                withCloseButton={withCloseButton}
            >
                {message}
            </Notification>
        ) : (
            <Text c={color}>{message}</Text>
        );

    if (!anchor) return content;

    return (
        <Stack>
            {content}
            <Anchor
                component={Link}
                href={anchor.href}
            >
                {anchor.label}
            </Anchor>
        </Stack>
    );
};
