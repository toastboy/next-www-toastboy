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
    return useSWR(`/api/footy/player/${idOrLogin}/lastplayed`, fetcher);
}

export function usePlayerClubs(idOrLogin: string) {
    return useSWR(`/api/footy/player/${idOrLogin}/clubs`, fetcher);
}

export function usePlayerCountries(idOrLogin: string) {
    return useSWR(`/api/footy/player/${idOrLogin}/countries`, fetcher);
}

export function usePlayerArse(idOrLogin: string) {
    return useSWR(`/api/footy/player/${idOrLogin}/arse`, fetcher);
}

export function usePlayerForm(idOrLogin: string, games: number) {
    return useSWR(`/api/footy/player/${idOrLogin}/form/${games}`, fetcher);
}

export function usePlayerYearsActive(idOrLogin: string) {
    return useSWR(`/api/footy/player/${idOrLogin}/yearsactive`, fetcher);
}

export function usePlayerRecord(idOrLogin: string, year: number) {
    return useSWR(`/api/footy/player/${idOrLogin}/record/${year}`, fetcher);
}
