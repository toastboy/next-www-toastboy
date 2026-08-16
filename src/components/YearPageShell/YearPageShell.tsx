'use client';

import { Group, Stack, StackProps, Title } from '@mantine/core';
import { ReactNode } from 'react';

import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { TitleWithYearDropdown } from '@/components/TitleWithYearDropdown/TitleWithYearDropdown';
import { FootyChannel } from '@/types/FootyChannel';

export interface Props extends Pick<
    StackProps,
    'gap' | 'align' | 'justify' | 'p'
> {
    title: string;
    year: number;
    validYears: number[];
    autoRefreshChannels?: FootyChannel | FootyChannel[];
    groupMb?: StackProps['gap'];
    subheading?: ReactNode;
    children: ReactNode;
}

export const YearPageShell = ({
    title,
    year,
    validYears,
    autoRefreshChannels,
    groupMb,
    subheading,
    children,
    ...stackProps
}: Props) => {
    const hasSubheading =
        typeof subheading === 'string'
            ? subheading.trim() !== ''
            : subheading != null;

    return (
        <Stack {...stackProps}>
            {autoRefreshChannels !== undefined && (
                <AutoRefresh channels={autoRefreshChannels} />
            )}
            <Group
                justify="center"
                w="100%"
                mb={groupMb}
            >
                <TitleWithYearDropdown
                    order={1}
                    title={title}
                    year={year}
                    validYears={validYears}
                />
            </Group>
            {hasSubheading ? (
                <Title
                    order={2}
                    mb="xl"
                >
                    {subheading}
                </Title>
            ) : null}
            {children}
        </Stack>
    );
};
