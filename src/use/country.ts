'use client';

import { fetcher } from './fetcher';
import useSWR from 'swr';

export function useCountry(isoCode: string) {
    return useSWR(`/api/footy/country/${isoCode}`, fetcher);
}
