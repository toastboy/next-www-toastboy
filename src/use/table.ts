import { EnumTable } from 'services/PlayerRecord';
import { fetcher } from './fetcher';
import useSWR from 'swr';
import { PlayerRecord } from '@prisma/client';

export function useTable(table: EnumTable, year: number, qualified?: boolean, take?: number) {
    let url = `/api/footy/table/${table}/${year}`;
    if (qualified !== undefined) url += `/${qualified}`;
    if (take !== undefined) url += `/${take}`;

    return useSWR<PlayerRecord[]>(url, fetcher);
}
