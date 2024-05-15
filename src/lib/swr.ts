'use client';

import useSWR from 'swr';

export enum FootyTable {
    points = 'points',
    averages = 'averages',
    stalwart = 'stalwart',
    speedy = 'speedy',
    pub = 'pub',
}

export interface FootyPlayerRecord {
    year: number,
    playerId: number,
    name: string,

    P: number,
    W: number,
    D: number,
    L: number,

    points: number,
    averages: number,
    stalwart: number,
    pub: number,
    speedy: number,
}

export interface FootyOutcome {
    playerId: number,
    gameDayId: number,
    points: number,
    goalie: boolean,
}

export const fetcher = (input: URL | RequestInfo, init?: RequestInit | undefined) =>
    fetch(input, init).then((res) => res.json());

export function useClub(id: number) {
    return useSWR(`/api/footy/club/${id}`, fetcher);
}

export function useCountry(isoCode: string) {
    return useSWR(`/api/footy/country/${isoCode}`, fetcher);
}

export function useGameYears() {
    return useSWR<number[]>(`/api/footy/gameyear`, fetcher);
}

export function useGameYear(year: number) {
    return useSWR<number>(`/api/footy/gameyear/${year}`, fetcher);
}

export function useGameDay(id: number) {
    return useSWR(`/api/footy/gameday/${id}`, fetcher);
}

export function usePlayer(idOrLogin: string) {
    return useSWR(`/api/footy/player/${idOrLogin}`, fetcher);
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
    return useSWR<number[]>(`/api/footy/player/${idOrLogin}/yearsactive`, fetcher);
}

export function usePlayerRecord(idOrLogin: string, year: number) {
    return useSWR<FootyPlayerRecord>(`/api/footy/player/${idOrLogin}/record/${year}`, fetcher);
}

export function useRecords() {
    return useSWR<FootyPlayerRecord[]>(`/api/footy/records`, fetcher);
}

export function useRecordsProgress() {
    return useSWR<[number, number]>(`/api/footy/records/progress`, fetcher);
}

export function useTable(table: FootyTable, year: number, qualified?: boolean, take?: number) {
    let url = `/api/footy/table/${table}/${year}`;
    if (qualified !== undefined) url += `/${qualified}`;
    if (take !== undefined) url += `/${take}`;

    return useSWR<FootyPlayerRecord[]>(url, fetcher);
}

export function useTeam(gameDay: number, team: string) {
    return useSWR<FootyOutcome[]>(`/api/footy/team/${gameDay}/${team}`, fetcher);
}

export function useWinners(table: FootyTable, year?: number) {
    return useSWR<FootyPlayerRecord[]>(`/api/footy/winners/${table}/${year}`, fetcher);
}
