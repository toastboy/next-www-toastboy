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

interface PageProps {
    params: Promise<{
        id: string,
    }>,
    searchParams?: Promise<{
        year?: string;
    }>;
}

/**
 * Unpacks and validates page parameters and search parameters for a player
 * page.
 *
 * This function performs the following operations:
 * - Extracts and validates the player ID (either numeric or login string)
 * - Retrieves the player from the database
 * - Validates the requested year against the player's active years
 * - Constructs canonical URLs and redirects if the current URL doesn't match
 * - Returns the player data, selected year, and all active years
 *
 * @param params - The page route parameters containing the player ID
 * @param searchParams - The URL search parameters, optionally containing a year
 * filter
 * @returns A promise resolving to an object containing the player record,
 * selected year, and array of active years
 * @throws {notFound} When the player is not found or the requested year is
 * invalid
 * @throws {permanentRedirect} When the current URL doesn't match the canonical
 * URL format
 */
const unpackParams = cache(async (
    params: PageProps['params'],
    searchParams: PageProps['searchParams'],
) => {
    const { id } = await params;

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
