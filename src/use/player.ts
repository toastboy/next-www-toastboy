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

export function usePlayerLastPlayed(idOrLogin: string) {
    const { data, error, isLoading } = useSWR(`/api/footy/player/${idOrLogin}/lastplayed`, fetcher);

    return {
        playerLastPlayed: data,
        playerLastPlayedIsLoading: isLoading,
        playerLastPlayedIsError: error,
    };
}

export function usePlayerClubs(idOrLogin: string) {
    return useSWR(`/api/footy/player/${idOrLogin}/clubs`, fetcher);
}
