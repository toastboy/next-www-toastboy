'use client';

import WinnersTable from 'components/WinnersTable';
import { FootyTable } from 'lib/swr';
import { notFound } from 'next/navigation';

interface PageProps {
    params: { params: string[] };
}

export const Page: React.FC<PageProps> = ({ params }) => {
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
        <>
            <h1 className="text-2xl font-bold">Winners</h1>
            {
                Object.keys(FootyTable).map((table) => {
                    return <WinnersTable key={table} table={table as FootyTable} year={year} />;
                })
            }
        </>
    );
};

export default Page;
