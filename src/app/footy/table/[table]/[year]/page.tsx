'use client';

import { Loader } from '@mantine/core';
import { Table } from 'components/Table';
import { FootyTable, useGameYear } from 'lib/swr';
import { notFound } from 'next/navigation';

export default function Page({
    params,
}: {
    params: { params: string[] },
}) {
    const { data: year, error, isLoading } = useGameYear(params.params[1]);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!year) return notFound();

    const table = FootyTable[params.params[0] as keyof typeof FootyTable];
    if (!(table in FootyTable)) return notFound();

    return (
        <>
            <Table table={table} year={year} />
        </>
    );
}
