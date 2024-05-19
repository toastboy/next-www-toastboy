'use client';

import GameYears from 'components/GameYears';
import { Table } from 'components/Table';
import { FootyTable } from 'lib/swr';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page({
    params,
}: {
    params: Record<string, string>,
}) {
    const [activeYear, setActiveYear] = useState(() => {
        const year = parseInt(params.year);
        return isNaN(year) ? 0 : year;
    });

    useEffect(() => {
        if (isNaN(activeYear)) {
            return notFound();
        }
    }, [activeYear]);

    const table = FootyTable[params.table as typeof FootyTable[keyof typeof FootyTable]];
    if (!(table in FootyTable)) return notFound();

    return (
        <>
            <GameYears activeYear={activeYear} onYearChange={setActiveYear} />
            <Table table={table} year={activeYear} />
        </>
    );
}
