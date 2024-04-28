'use client';

import { Outcome } from '@prisma/client';
import useSWR from 'swr';
import { fetcher } from './fetcher';

export function useTeam(gameDay: number, team: string) {
    return useSWR<Outcome[]>(`/api/footy/team/${gameDay}/${team}`, fetcher);
}
