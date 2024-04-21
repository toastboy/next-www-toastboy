import { fetcher } from './fetcher';
import useSWR from 'swr';

export function useClub(id: number) {
    return useSWR(`/api/footy/club/${id}`, fetcher);
}
