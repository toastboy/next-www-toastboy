'use client';

import Table from 'components/Table';
import TableYears from 'components/TableYears';
import { FootyTable } from 'lib/swr';
import { notFound, usePathname, useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

interface PageProps {
    params: Promise<{ year: string, table: FootyTable }>,
}

const Page: React.FC<PageProps> = props => {
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

    if (!(table in FootyTable)) return notFound();

    return (
        <>
            <TableYears activeYear={activeYear} onYearChange={setActiveYear} />
            <Table table={table} year={activeYear} />
        </>
    );
};

export default Page;
