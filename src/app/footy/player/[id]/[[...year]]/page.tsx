import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { TableName } from 'prisma/generated/browser';
import { TableNameSchema } from 'prisma/zod/schemas';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';
import { cache } from 'react';
import z from 'zod';

import { PlayerProfile } from '@/components/PlayerProfile/PlayerProfile';
import { getUserRole } from '@/lib/auth.server';
import arseService from '@/services/Arse';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerRecordService from '@/services/PlayerRecord';

/**
 * Props for the player page component.
 *
 * @property {Promise<{id: string, year?: [string]}>} params - Route parameters
 * containing:
 *   - `id`: The unique identifier of the player
 *   - `year`: Array containing optional segments from the catch-all route.
 *     There's only one defined: this is the legacy way to refer to a specific
 *     year: requests containing this will be redirected.
 * @property {Promise<{year?: string}>} [searchParams] - Optional query string
 * parameters containing:
 *   - `year`: Optional year filter from query string
 */
interface PageProps {
    params: Promise<{
        id: string,
        year?: [string],
    }>,
    searchParams?: Promise<{
        year?: string;
    }>;
}

/**
 * Unpacks and validates URL parameters and search parameters for the player
 * page.
 *
 * @param props - The page props containing route parameters and search
 * parameters
 * @param props.params - Promise resolving to route parameters with `id` and
 * optional `year` array
 * @param props.searchParams - Promise resolving to search parameters
 *
 * @returns A promise resolving to an object containing:
 *   - `player` - The player object retrieved by ID or login
 *   - `year` - The validated year as a number, or undefined if not provided
 *   - `activeYears` - Array of years the player was active
 *
 * @throws Redirects permanently to query parameter format if year is provided
 * in URL path
 * @throws Calls `notFound()` if player cannot be found or year is invalid/not
 * in active years
 */
const unpackParams = cache(async (
    params: PageProps['params'],
    searchParams: PageProps['searchParams'],
) => {
    const { id, year: yearParam } = await params;

    if (yearParam?.[0]) {
        permanentRedirect(`/footy/player/${id}?year=${yearParam[0]}`);
    }

    const resolvedSearchParams = await searchParams;
    const playerId = z.coerce.number().int().min(1).safeParse(id);
    const player = await (playerId.success ?
        playerService.getById(playerId.data) :
        playerService.getByLogin(id));
    if (!player) notFound();

    const activeYears = await playerService.getYearsActive(player.id);
    const yearResult = z.coerce.number().int().min(0).safeParse(resolvedSearchParams?.year ?? 0);
    const year = yearResult.success ? yearResult.data : undefined;
    if (year === undefined || !activeYears.includes(year)) notFound();

    const canonicalSearch = year ? `?year=${year}` : '';
    const canonicalUrl = `/footy/player/${player.id}${canonicalSearch}`;
    const currentSearch = resolvedSearchParams?.year ? `?year=${resolvedSearchParams.year}` : '';
    const currentUrl = `/footy/player/${id}${currentSearch}`;
    if (currentUrl !== canonicalUrl) permanentRedirect(canonicalUrl);

    return { player, year, activeYears };
});

/**
 * Generates metadata for the player page.
 * @param props - The page props containing player ID and optional year
 * parameters
 * @returns A promise that resolves to metadata object with the player name and
 * year in the title
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const { player, year } = await unpackParams(props.params, props.searchParams);

    return {
        title: `${player.name}: ${year || 'All-time'}`,
    };
}

const Page: React.FC<PageProps> = async props => {
    const { player, year, activeYears } = await unpackParams(props.params, props.searchParams);

    const lastPlayed = await playerService.getLastPlayed(player.id, year);
    const gameDayId = lastPlayed ? lastPlayed.gameDayId : 0;
    const form = await playerService.getForm(player.id, gameDayId, year);
    const clubs = await clubSupporterService.getByPlayer(player.id);
    const countries = await countrySupporterService.getByPlayer(player.id);
    const arse = (await getUserRole() === 'admin') ?
        await arseService.getByPlayer(player.id) :
        null;
    const record = await playerRecordService.getForYearByPlayer(year, player.id);
    const trophies = new Map<TableName, PlayerRecordType[]>();
    await Promise.all(TableNameSchema.options.map(async (table) => {
        const winners = await playerRecordService.getWinners(table, year, player.id);
        trophies.set(table, winners);
    }));

    return (
        <PlayerProfile
            key={player.id}
            player={player}
            year={year}
            form={form}
            lastPlayed={lastPlayed}
            clubs={clubs}
            countries={countries}
            arse={arse}
            activeYears={activeYears}
            record={record}
            trophies={trophies}
        />
    );
};

export default Page;
