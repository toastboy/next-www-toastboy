'use client';

import WinnersTable from 'components/WinnersTable';
import { FootyTable } from 'lib/swr';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface PageProps {
    params: Promise<{ params: string[] }>,
}

export const Page: React.FC<PageProps> = (props) => {
    const params = use(props.params);
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
        // TODO: Change styles to use Mantine components
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
