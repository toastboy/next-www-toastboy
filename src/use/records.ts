'use client';

import { fetcher } from './fetcher';
import useSWR from 'swr';
import { PlayerRecord } from '@prisma/client';

export function useRecords() {
    return useSWR<PlayerRecord[]>(`/api/footy/records`, fetcher);
}

export function useRecordsProgress() {
    return useSWR<[number, number]>(`/api/footy/records/progress`, fetcher);
}
