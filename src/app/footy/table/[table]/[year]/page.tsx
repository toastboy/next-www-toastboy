'use client';

import { Table } from 'components/Table';
import { FootyTable } from 'lib/swr';
import { notFound } from 'next/navigation';

export default function Page({
    params,
}: {
    params: Record<string, string>,
}) {
    const year = parseInt(params.year);
    if (isNaN(year)) return notFound();

    const table = FootyTable[params.table as typeof FootyTable[keyof typeof FootyTable]];
    if (!(table in FootyTable)) return notFound();

    return (
        <>
            <Table table={table} year={year} />
        </>
    );
}
