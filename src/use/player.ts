import { fetcher } from './fetcher';
import useSWR from 'swr';

export function usePlayer(idOrLogin: string) {
    const { data, error, isLoading } = useSWR(`/api/footy/player/${idOrLogin}`, fetcher);

    return {
        player: data,
        playerIsLoading: isLoading,
        playerIsError: error,
    };
}

export function usePlayerName(idOrLogin: string) {
    const { data, error, isLoading } = useSWR(`/api/footy/player/${idOrLogin}/name`, fetcher);

    return {
        playerName: data,
        playerNameIsLoading: isLoading,
        playerNameIsError: error,
    };
}
