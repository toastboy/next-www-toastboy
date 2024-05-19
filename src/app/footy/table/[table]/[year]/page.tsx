'use client';

import TableYears from 'components/TableYears';
import { Table } from 'components/Table';
import { FootyTable } from 'lib/swr';
import { notFound, useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page({
    params,
}: {
    params: Record<string, string>,
}) {
    const pathname = usePathname();
    const router = useRouter();

    const [activeYear, setActiveYear] = useState(() => {
        const year = params.year === "all-time" ? 0 : parseInt(params.year);
        return isNaN(year) ? 0 : year;
    });

    useEffect(() => {
        if (isNaN(activeYear)) {
            return notFound();
        }
        const targetURL = pathname.replace(/\/[^/]+$/, `/${activeYear === 0 ? "all-time" : activeYear}`);
        if (pathname !== targetURL) {
            router.push(targetURL);
        }
    }, [activeYear, params.table, params.year, pathname, router]);

    const table = FootyTable[params.table as typeof FootyTable[keyof typeof FootyTable]];
    if (!(table in FootyTable)) return notFound();

    return (
        <>
            <TableYears activeYear={activeYear} onYearChange={setActiveYear} />
            <Table table={table} year={activeYear} />
        </>
    );
}
