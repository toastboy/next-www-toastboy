'use client';

import Table from 'components/Table/Table';
import { FootyTable } from 'lib/swr';
import { notFound } from 'next/navigation';
import { use } from "react";

interface PageProps {
    params: Promise<{ table: FootyTable }>;
}

export const Page: React.FC<PageProps> = props => {
    const params = use(props.params);
    const { table } = params;

    if (!(table in FootyTable)) return notFound();

    return (
        <Table table={table} year={0} />
    );
};

export default Page;
