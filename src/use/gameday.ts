'use client';

import { fetcher } from './fetcher';
import useSWR from 'swr';

export function useGameYears() {
    return useSWR(`/api/footy/gameyears`, fetcher);
}

export function useGameDay(id: number) {
    return useSWR(`/api/footy/gameday/${id}`, fetcher);
}
