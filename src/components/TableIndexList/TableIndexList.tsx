'use client';

import { List } from '@mantine/core';
import Link from 'next/link';

const tables = [
    {
        href: '/footy/table/points',
        label: 'Points',
        description:
            'The Blue Riband table: rewards both winning and attendance.',
    },
    {
        href: '/footy/table/averages',
        label: 'Averages',
        description: 'Best average points per game.',
    },
    {
        href: '/footy/table/stalwart',
        label: 'Stalwart',
        description: 'The one you win just by turning up.',
    },
    {
        href: '/footy/table/speedy',
        label: 'Captain Speedy',
        description:
            'Rewards people for responding early to the call for players.',
    },
];

export const TableIndexList = () => (
    <List>
        {tables.map(({ href, label, description }) => (
            <List.Item key={href}>
                <Link href={href}>{label}</Link> - {description}
            </List.Item>
        ))}
    </List>
);
