'use client';

import useSWR from 'swr';
import { Arse, Club, ClubSupporterWithClub, Country, CountrySupporterWithCountry, GameDay, Outcome, Player, PlayerData, PlayerRecord, PlayerRecordWithPlayer, TableName, TurnoutByYear, WDL } from './types';

const fetcher = (input: URL | RequestInfo, init?: RequestInit | undefined) =>
    fetch(input, init).then((res) => res.json());

export function useClub(id: number) {
    return useSWR<Club>(`/api/footy/club/${id}`, fetcher);
}

export function useCountry(isoCode: string) {
    return useSWR<Country>(`/api/footy/country/${isoCode}`, fetcher);
}

export function useGameYears() {
    return useSWR<number[]>(`/api/footy/gameyear`, fetcher);
}

export function useGameYear(year: number) {
    return useSWR<boolean>(`/api/footy/gameyear/${year}`, fetcher);
}

export function useGameDay(id: number) {
    return useSWR<GameDay>(`/api/footy/gameday/${id}`, fetcher);
}

export function useGameDays() {
    return useSWR<GameDay[]>(`/api/footy/gameday`, fetcher);
}

export function useCurrentGame() {
    return useSWR<GameDay>(`/api/footy/currentgame`, fetcher);
}

export function usePlayer(idOrLogin: string) {
    return useSWR<Player>(`/api/footy/player/${idOrLogin}`, fetcher);
}

export function usePlayerLastPlayed(idOrLogin: string) {
    return useSWR<Outcome>(`/api/footy/player/${idOrLogin}/lastplayed`, fetcher);
}

export function usePlayerClubs(idOrLogin: string) {
    return useSWR<ClubSupporterWithClub[]>(`/api/footy/player/${idOrLogin}/clubs`, fetcher);
}

export function usePlayerCountries(idOrLogin: string) {
    return useSWR<CountrySupporterWithCountry[]>(`/api/footy/player/${idOrLogin}/countries`, fetcher);
}

export function usePlayerArse(idOrLogin: string) {
    return useSWR<Arse>(`/api/footy/player/${idOrLogin}/arse`, fetcher);
}

export function usePlayerForm(idOrLogin: string, games: number) {
    return useSWR<Outcome[]>(`/api/footy/player/${idOrLogin}/form/${games}`, fetcher);
}

export function usePlayerYearsActive(idOrLogin: string) {
    return useSWR<number[]>(`/api/footy/player/${idOrLogin}/yearsactive`, fetcher);
}

export function usePlayerRecord(idOrLogin: string, year: number) {
    return useSWR<PlayerRecordWithPlayer>(`/api/footy/player/${idOrLogin}/record/${year}`, fetcher);
}

export function usePlayers() {
    return useSWR<PlayerData[]>(`/api/footy/players`, fetcher);
}

export function useRecordsProgress() {
    return useSWR<[number, number]>(`/api/footy/records/progress`, fetcher);
}

export function useTableYears() {
    const { data, error } = useSWR<number[]>(`/api/footy/tableyear`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useTable(table: TableName, year: number, qualified?: boolean, take?: number) {
    let url = `/api/footy/table/${table}/${year}`;
    if (qualified !== undefined) url += `/${qualified}`;
    if (take !== undefined) url += `/${take}`;

    return useSWR<PlayerRecord[]>(url, fetcher);
}

export function useTeam(gameDay: number, team: string) {
    return useSWR<Outcome[]>(`/api/footy/team/${gameDay}/${team}`, fetcher);
}

export function useWinners(table: TableName, year?: number) {
    let url = `/api/footy/winners/${table}`;
    if (year !== undefined) url += `/${year}`;

    return useSWR<PlayerRecordWithPlayer[]>(url, fetcher);
}

export function useTurnoutByYear() {
    return useSWR<TurnoutByYear[]>(`/api/footy/turnout/byyear`, fetcher);
}

export function useBibs(year?: number) {
    const { data, error } = useSWR<WDL>(`/api/footy/bibs?year=${year}`, fetcher);
    throw new Error("Buttocksssss");
    if (error) throw error;
    return data || null;
}
