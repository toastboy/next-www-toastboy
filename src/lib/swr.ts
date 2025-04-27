'use client';

import { Arse, Club, ClubSupporter, Country, CountrySupporter, GameDay, Outcome, Player, PlayerRecord, TableNameType } from 'prisma/generated/zod';
import useSWR from 'swr';
import { PlayerData, TurnoutByYear, WDL } from './types';

const fetcher = (input: URL | RequestInfo, init?: RequestInit | undefined) =>
    fetch(input, init).then((res) => res.json());

export function useClub(id: number) {
    const { data, error } = useSWR<Club>(`/api/footy/club/${id}`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useCountry(isoCode: string) {
    const { data, error } = useSWR<Country>(`/api/footy/country/${isoCode}`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useGameYears() {
    const { data, error } = useSWR<number[]>(`/api/footy/gameyear`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useGameYear(year: number) {
    const { data, error } = useSWR<boolean>(`/api/footy/gameyear/${year}`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useGameDay(id: number) {
    const { data, error } = useSWR<GameDay>(`/api/footy/gameday/${id}`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useGameDays() {
    const { data, error } = useSWR<GameDay[]>(`/api/footy/gameday`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useCurrentGame() {
    const { data, error } = useSWR<GameDay>(`/api/footy/currentgame`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayer(idOrLogin: string) {
    const { data, error } = useSWR<Player>(`/api/footy/player/${idOrLogin}`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayerLastPlayed(idOrLogin: string) {
    const { data, error } = useSWR<Outcome>(`/api/footy/player/${idOrLogin}/lastplayed`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayerClubs(idOrLogin: string) {
    const { data, error } = useSWR<ClubSupporter[]>(`/api/footy/player/${idOrLogin}/clubs`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayerCountries(idOrLogin: string) {
    const { data, error } = useSWR<CountrySupporter[]>(`/api/footy/player/${idOrLogin}/countries`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayerArse(idOrLogin: string) {
    const { data, error } = useSWR<Arse>(`/api/footy/player/${idOrLogin}/arse`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayerForm(idOrLogin: string, games: number) {
    const { data, error } = useSWR<Outcome[]>(`/api/footy/player/${idOrLogin}/form/${games}`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayerYearsActive(idOrLogin: string) {
    const { data, error } = useSWR<number[]>(`/api/footy/player/${idOrLogin}/yearsactive`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayerRecord(idOrLogin: string, year: number) {
    const { data, error } = useSWR<PlayerRecord>(`/api/footy/player/${idOrLogin}/record/${year}`, fetcher);
    if (error) throw error;
    return data || null;
}

export function usePlayers() {
    const { data, error } = useSWR<PlayerData[]>(`/api/footy/players`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useRecordsProgress() {
    const { data, error, mutate } = useSWR<[number, number]>(`/api/footy/records/progress`, fetcher);
    if (error) throw error;
    return { data, mutate };
}

export function useTableYears() {
    const { data, error } = useSWR<number[]>(`/api/footy/tableyear`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useTable(table: TableNameType, year: number, qualified?: boolean, take?: number) {
    let url = `/api/footy/table/${table}/${year}`;
    if (qualified !== undefined) url += `/${qualified}`;
    if (take !== undefined) url += `/${take}`;

    const { data, error } = useSWR<PlayerRecord[]>(url, fetcher);
    if (error) throw error;
    return data || null;
}

export function useTeam(gameDay: number, team: string) {
    const { data, error } = useSWR<Outcome[]>(`/api/footy/team/${gameDay}/${team}`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useWinners(table: TableNameType, year?: number) {
    let url = `/api/footy/winners/${table}`;
    if (year !== undefined) url += `/${year}`;

    const { data, error } = useSWR<PlayerRecord[]>(url, fetcher);
    if (error) throw error;
    return data || null;
}

export function useTurnoutByYear() {
    const { data, error } = useSWR<TurnoutByYear[]>(`/api/footy/turnout/byyear`, fetcher);
    if (error) throw error;
    return data || null;
}

export function useBibs(year?: number) {
    const { data, error } = useSWR<WDL>(`/api/footy/bibs?year=${year}`, fetcher);
    if (error) throw error;
    return data || null;
}
