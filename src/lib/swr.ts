'use client';

import { TableName } from 'prisma/generated/schemas';
import { ArseType } from 'prisma/generated/schemas/models/Arse.schema';
import { ClubType } from 'prisma/generated/schemas/models/Club.schema';
import { ClubSupporterType } from 'prisma/generated/schemas/models/ClubSupporter.schema';
import { CountryType } from 'prisma/generated/schemas/models/Country.schema';
import { CountrySupporterType } from 'prisma/generated/schemas/models/CountrySupporter.schema';
import { GameDayType } from 'prisma/generated/schemas/models/GameDay.schema';
import { OutcomeType } from 'prisma/generated/schemas/models/Outcome.schema';
import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';
import { PlayerRecordType } from 'prisma/generated/schemas/models/PlayerRecord.schema';
import useSWR from 'swr';

import { PlayerData, TurnoutByYear, WDL } from './types';

const fetcher = (input: URL | RequestInfo, init?: RequestInit) =>
    fetch(input, init).then((res) => res.json());

export function useClub(id: number) {
    const { data, error } = useSWR<ClubType, Error>(`/api/footy/club/${id}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useCountry(isoCode: string) {
    const { data, error } = useSWR<CountryType, Error>(`/api/footy/country/${isoCode}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useGameYears() {
    const { data, error } = useSWR<number[], Error>(`/api/footy/gameyear`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useGameYear(year: number) {
    const { data, error } = useSWR<boolean, Error>(`/api/footy/gameyear/${year}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useGameDay(id: number) {
    const { data, error } = useSWR<GameDayType, Error>(`/api/footy/gameday/${id}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useGameDays() {
    const { data, error } = useSWR<GameDayType[], Error>(`/api/footy/gameday`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useCurrentGame() {
    const { data, error } = useSWR<GameDayType, Error>(`/api/footy/currentgame`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayer(idOrLogin: string) {
    const { data, error } = useSWR<PlayerType, Error>(`/api/footy/player/${idOrLogin}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerLastPlayed(idOrLogin: string) {
    const { data, error } = useSWR<OutcomeType, Error>(`/api/footy/player/${idOrLogin}/lastplayed`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerClubs(idOrLogin: string) {
    const { data, error } = useSWR<ClubSupporterType[], Error>(`/api/footy/player/${idOrLogin}/clubs`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerCountries(idOrLogin: string) {
    const { data, error } = useSWR<CountrySupporterType[], Error>(`/api/footy/player/${idOrLogin}/countries`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerArse(idOrLogin: string) {
    const { data, error } = useSWR<ArseType, Error>(`/api/footy/player/${idOrLogin}/arse`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerForm(idOrLogin: string, games: number) {
    const { data, error } = useSWR<OutcomeType[], Error>(`/api/footy/player/${idOrLogin}/form/${games}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerYearsActive(idOrLogin: string) {
    const { data, error } = useSWR<number[], Error>(`/api/footy/player/${idOrLogin}/yearsactive`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerRecord(idOrLogin: string, year: number) {
    const { data, error } = useSWR<PlayerRecordType, Error>(`/api/footy/player/${idOrLogin}/record/${year}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayers() {
    const { data, error } = useSWR<PlayerData[], Error>(`/api/footy/players`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useRecordsProgress() {
    const { data, error, mutate } = useSWR<[number, number], Error>(`/api/footy/records/progress`, fetcher);
    if (error) throw error;
    return { data, mutate };
}

export function useTableYears() {
    const { data, error } = useSWR<number[], Error>(`/api/footy/tableyear`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useTable(table: TableName, year: number, qualified?: boolean, take?: number) {
    let url = `/api/footy/table/${table}/${year}`;
    if (qualified !== undefined) url += `/${qualified}`;
    if (take !== undefined) url += `/${take}`;

    const { data, error } = useSWR<PlayerRecordType[], Error>(url, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useTeam(gameDay: number, team: string) {
    const { data, error } = useSWR<OutcomeType[], Error>(`/api/footy/team/${gameDay}/${team}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useWinners(table: TableName, year?: number) {
    let url = `/api/footy/winners/${table}`;
    if (year !== undefined) url += `/${year}`;

    const { data, error } = useSWR<PlayerRecordType[], Error>(url, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useTurnoutByYear() {
    const { data, error } = useSWR<TurnoutByYear[], Error>(`/api/footy/turnout/byyear`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useBibs(year?: number) {
    const { data, error } = useSWR<WDL, Error>(`/api/footy/bibs?year=${year}`, fetcher);
    if (error) throw error;
    return data ?? null;
}
