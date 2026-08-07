'use client';

import {
    Badge,
    Flex,
    Tooltip,
} from '@mantine/core';
import Link from 'next/link';

import { formatDate } from '@/lib/dates';
import { PlayerFormType } from '@/types';

export interface Props {
    form: PlayerFormType[];
}

const colorMap = new Map<number | null | undefined, string>([
    [null, 'var(--mantine-color-gray-5)'],
    [undefined, 'var(--mantine-color-gray-5)'],
    [0, 'var(--mantine-color-red-6)'],
    [1, 'var(--mantine-color-yellow-5)'],
    [3, 'var(--mantine-color-green-6)'],
]);

const resultLabel = new Map<number | null | undefined, string>([
    [null, 'Did not play'],
    [undefined, 'Did not play'],
    [0, 'Lost'],
    [1, 'Drew'],
    [3, 'Won'],
]);

const badgeColor = (points: number | null | undefined) =>
    colorMap.get(points) ?? 'var(--mantine-color-gray-5)';

const badgeSize = (i: number) => `${(i + 1) * 0.025 + 0.5}rem`;

export const PlayerForm = ({ form }: Props) => {
    if (form.length === 0) return null;

    return (
        <Flex
            align="center"
            gap="0.2rem"
            justify="center"
            wrap="wrap"
            mt={{ base: 0, xs: "sm" }}
        >
            {form.map((data, i) => {
                // Padding entry: no associated game day, just a grey placeholder.
                if (!data.gameDay) {
                    return (
                        <Badge
                            key={i}
                            aria-hidden="true"
                            color={badgeColor(data.points)}
                            variant="filled"
                            size={badgeSize(i)}
                            circle
                        />
                    );
                }

                const linkText = `${formatDate(data.gameDay.date)} – ${resultLabel.get(data.points) ?? ''}`;

                return (
                    <Tooltip key={i} label={linkText} withArrow>
                        <Badge
                            component={Link}
                            href={`/footy/game/${data.gameDay.id}`}
                            style={{ cursor: 'pointer' }}
                            aria-label={linkText}
                            color={badgeColor(data.points)}
                            variant="filled"
                            size={badgeSize(i)}
                            circle
                        />
                    </Tooltip>
                );
            })}
        </Flex>
    );
};
