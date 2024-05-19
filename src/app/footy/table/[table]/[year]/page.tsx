'use client';

import GameYears from 'components/GameYears';
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
        const year = parseInt(params.year);
        return isNaN(year) ? 0 : year;
    });

    useEffect(() => {
        if (isNaN(activeYear)) {
            return notFound();
        }
        if (params.year !== activeYear.toString()) {
            router.push(pathname.replace(/\/\d+$/, `/${activeYear}`));
        }
    }, [activeYear, params.table, params.year, pathname, router]);

    const table = FootyTable[params.table as typeof FootyTable[keyof typeof FootyTable]];
    if (!(table in FootyTable)) return notFound();

    return (
        <>
            <GameYears activeYear={activeYear} onYearChange={setActiveYear} />
            <Table table={table} year={activeYear} />
        </>
    );
}
