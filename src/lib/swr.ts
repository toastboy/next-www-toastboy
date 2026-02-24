'use client';

import { TableName } from 'prisma/zod/schemas';
import { ArseType } from 'prisma/zod/schemas/models/Arse.schema';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';
import { ClubSupporterType } from 'prisma/zod/schemas/models/ClubSupporter.schema';
import { CountryType } from 'prisma/zod/schemas/models/Country.schema';
import { CountrySupporterType } from 'prisma/zod/schemas/models/CountrySupporter.schema';
import { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { OutcomeType } from 'prisma/zod/schemas/models/Outcome.schema';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';
import useSWR from 'swr';
import {
    PlayerDataType,
    PlayerFormType,
    TurnoutByYearType,
    WDLType,
} from 'types';

import { assertOkResponse, normalizeUnknownError } from '@/lib/errors';

/**
 * Fetches data from a given URL and returns it as a typed response.
 *
 * This function is designed to be used as a fetcher for SWR hooks. It performs
 * a GET request to the specified URL, checks if the response is ok, and then
 * attempts to parse the response as JSON. If the response is not ok or if JSON
 * parsing fails, it throws a normalized error with a public message.
 *
 * Note that the caller must validate the resulting data against the expected
 * type T, as this function will not perform any runtime type checking.
 *
 * @template T - The expected type of the response data.
 * @param url - The URL to fetch from.
 * @returns A promise that resolves to the fetched data typed as T.
 * @throws Will throw a normalized error if the response is not ok or if JSON
 * parsing fails.
 *
 * @example
 * ```typescript
 * const data = await fetcher<{ name: string }>('/api/user');
 * ```
 */
const fetcher = async <T>(url: string): Promise<T> => {
    try {
        const response = await fetch(url);
        await assertOkResponse(response, {
            method: 'GET',
            fallbackMessage: 'Failed to load data.',
        });

        const data: unknown = await response.json();
        return data as T;
    } catch (error) {
        throw normalizeUnknownError(error, {
            message: 'SWR request failed.',
            publicMessage: 'Failed to load data.',
        });
    }
};

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

export function usePlayer(id: number) {
    const { data, error } = useSWR<PlayerType, Error>(`/api/footy/player/${id}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerLastPlayed(id: number) {
    const { data, error } = useSWR<OutcomeType, Error>(`/api/footy/player/${id}/lastplayed`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerClubs(id: number) {
    const { data, error } = useSWR<ClubSupporterType[], Error>(`/api/footy/player/${id}/clubs`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerCountries(id: number) {
    const { data, error } = useSWR<CountrySupporterType[], Error>(`/api/footy/player/${id}/countries`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerArse(id: number) {
    const { data, error } = useSWR<ArseType, Error>(`/api/footy/player/${id}/arse`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerForm(id: number, games: number) {
    const { data, error } = useSWR<PlayerFormType[], Error>(`/api/footy/player/${id}/form/${games}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerYearsActive(id: number) {
    const { data, error } = useSWR<number[], Error>(`/api/footy/player/${id}/yearsactive`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayerRecord(id: number, year: number) {
    const { data, error } = useSWR<PlayerRecordType, Error>(`/api/footy/player/${id}/record/${year}`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function usePlayers() {
    const { data, error } = useSWR<PlayerDataType[], Error>(`/api/footy/players`, fetcher);
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
    if (qualified !== undefined) url += `/${String(qualified)}`;
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
    const { data, error } = useSWR<TurnoutByYearType[], Error>(`/api/footy/turnout/byyear`, fetcher);
    if (error) throw error;
    return data ?? null;
}

export function useBibs(year?: number) {
    const { data, error } = useSWR<WDLType, Error>(`/api/footy/bibs?year=${String(year)}`, fetcher);
    if (error) throw error;
    return data ?? null;
}
