'use client';

import type { TitleOrder } from '@mantine/core';
import { Group, Menu, Title, UnstyledButton } from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { getYearName } from '@/lib/tables';


export interface Props {
    title: string;
    order: TitleOrder;
    year: number;
    validYears: number[];
}

export function TitleWithYearDropdown({ title, order, year, validYears }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const createYearHref = useCallback((year: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (year === 0) {
            params.delete('year');
        } else {
            params.set('year', String(year));
        }
        const query = params.toString();
        return query ? `${pathname}?${query}` : pathname;
    }, [pathname, searchParams]);

    return (
        <Group gap="xs" align="center">
            <Title order={order}>{title}</Title>

            <Menu shadow="md" width={180} styles={{ dropdown: { maxHeight: '60vh', overflowY: 'auto' } }}>
                <Menu.Target>
                    <UnstyledButton
                        style={{
                            fontSize: `var(--mantine-h${order as number}-font-size)`,
                            fontWeight: `var(--mantine-h${order as number}-font-weight)`,
                            color: 'var(--mantine-color-anchor)',
                            border: '1px solid var(--mantine-primary-color-3)',
                            borderRadius: 'var(--mantine-radius-sm)',
                            padding: '0 8px',
                        }}
                    >
                        <Group gap={4}>
                            {getYearName(year)}
                            <IconChevronDown size={14} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    {validYears.map(r => (
                        <Menu.Item
                            key={r}
                            leftSection={r === year ? <IconCheck size={14} /> : null}
                            onClick={() => router.push(createYearHref(r))}
                        >
                            {getYearName(r)}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
}
