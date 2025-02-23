import Table from 'components/Table/Table';
import { TableName } from 'lib/types';
import { notFound } from 'next/navigation';
import { use } from "react";

interface PageProps {
    params: Promise<{ table: TableName }>;
}

export const Page: React.FC<PageProps> = props => {
    const params = use(props.params);
    const { table } = params;

    if (!(table in TableName)) return notFound();

    return (
        <Table table={table} year={0} />
    );
};

export default Page;
