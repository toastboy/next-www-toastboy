'use client';

import { EnumTable } from 'services/PlayerRecord';
import { fetcher } from './fetcher';
import useSWR from 'swr';
import { PlayerRecord } from '@prisma/client';

export function useWinners(table: EnumTable, year?: number) {
    return useSWR<PlayerRecord[]>(`/api/footy/winners/${table}/${year}`, fetcher);
}
