'use client';

import WinnersTable from 'components/WinnersTable';
import { notFound } from 'next/navigation';
import { FootyTable } from 'lib/swr';

export default function Page({
    params,
}: {
    params: { params: string[] },
}) {
    let year = undefined;

    if (params.params) {
        switch (params.params.length) {
            case 0:
                break;
            case 1:
                {
                    year = params.params[0] ? parseInt(params.params[0]) : 0;
                    if (isNaN(year)) {
                        return notFound();
                    }
                }
                break;
            default:
                return notFound();
        }
    }

    return (
        <div className="px-6 py-4">
            <h1 className="text-2xl font-bold">Winners</h1>
            {Object.keys(FootyTable).map((table) => {
                return <WinnersTable key={table} table={table as FootyTable} year={year} />;
            })}
        </div>
    );
}
