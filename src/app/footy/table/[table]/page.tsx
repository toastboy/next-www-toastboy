'use client';

import Table from 'components/Table';
import { FootyTable } from 'lib/swr';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Record<string, string>;
}

export const Page: React.FC<PageProps> = ({ params }) => {
    const table = FootyTable[params.table as typeof FootyTable[keyof typeof FootyTable]];
    if (!(table in FootyTable)) return notFound();

    return (
        <Table table={table} year={0} />
    );
};

export default Page;
