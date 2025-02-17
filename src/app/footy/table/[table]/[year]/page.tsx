'use client';

import Table from 'components/Table/Table';
import TableYears from 'components/TableYears/TableYears';
import { TableName } from 'lib/types';
import { notFound, usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

interface Props {
    params: Promise<{ year: string, table: TableName }>,
}

const Page: React.FC<Props> = props => {
    const { year, table } = use(props.params);
    const pathname = usePathname();
    const router = useRouter();

    const [activeYear, setActiveYear] = useState(() => {
        const yearnum = year === "all-time" ? 0 : parseInt(year);
        return isNaN(yearnum) ? 0 : yearnum;
    });

    useEffect(() => {
        if (isNaN(activeYear)) {
            return notFound();
        }
        const targetURL = pathname.replace(/\/[^/]+$/, `/${activeYear === 0 ? "all-time" : activeYear}`);
        if (pathname !== targetURL) {
            router.push(targetURL);
        }
    }, [activeYear, table, year, pathname, router]);

    if (!(table in TableName)) return notFound();

    return (
        <>
            <TableYears activeYear={activeYear} onYearChange={setActiveYear} />
            <Table table={table} year={activeYear} />
        </>
    );
};

export default Page;
