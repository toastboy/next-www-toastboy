import { notFound, redirect } from 'next/navigation';
import { TableName } from 'prisma/generated/browser';
import { TableNameSchema } from 'prisma/zod/schemas';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

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
        year: [string],
    }>,
}

export async function generateMetadata(props: PageProps) {
    try {
        const { id } = await props.params;
        const playerId = Number(id);
        const player = Number.isNaN(playerId)
            ? await playerService.getByLogin(id)
            : await playerService.getById(playerId);
        if (!player) return {};
        const name = playerService.getName(player);
        return name ? { title: `${name}` } : {};
    }
    catch (error) {
        throw new Error(`Getting player metadata: ${String(error)}`);
    }
}

const Page: React.FC<PageProps> = async props => {
    const { id, year } = await props.params;
    const yearNum = year ? parseInt(year[0]) : 0;
    const playerId = Number(id);
    const player = Number.isNaN(playerId)
        ? await playerService.getByLogin(id)
        : await playerService.getById(playerId);

    if (!player) return notFound();

    if (player.id.toString() != id) {
        redirect(`/footy/player/${player.id}`);
    }

    const playerName = playerService.getName(player);
    const lastPlayed = await playerService.getLastPlayed(player.id, yearNum);
    const gameDayId = lastPlayed ? lastPlayed.gameDayId : 0;
    const form = await playerService.getForm(player.id, gameDayId, yearNum);
    const clubs = await clubSupporterService.getByPlayer(player.id);
    const countries = await countrySupporterService.getByPlayer(player.id);
    const arse = (await getUserRole() === 'admin') ?
        await arseService.getByPlayer(player.id) :
        null;
    const activeYears = await playerService.getYearsActive(player.id);
    const record = await playerRecordService.getForYearByPlayer(yearNum, player.id);
    const trophies = new Map<TableName, PlayerRecordType[]>();
    await Promise.all(TableNameSchema.options.map(async (table) => {
        const winners = await playerRecordService.getWinners(table, yearNum, player.id);
        trophies.set(table, winners);
    }));

    return (
        <PlayerProfile
            playerName={playerName}
            key={player.id}
            player={player}
            year={yearNum}
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
