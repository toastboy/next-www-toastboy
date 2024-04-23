import { fetcher } from './fetcher';
import useSWR from 'swr';

export function useGameDay(id: number) {
    return useSWR(`/api/footy/gameday/${id}`, fetcher);
}
