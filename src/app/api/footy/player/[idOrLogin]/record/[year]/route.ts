import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';
import { getPlayer } from '../../../common';
import { handleGET } from 'app/api/footy/common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

async function getForYearByPlayer(
    { params }: { params: Record<string, string> },
): Promise<Record<string, boolean | number | Date | string | null> | null> {
    const player = await getPlayer(params.idOrLogin);
    if (!player) {
        return null;
    }

    const record = await playerRecordService.getForYearByPlayer(parseInt(params.year), player.id);
    if (!record) {
        return null;
    }

    return { ...record, name: player.name };
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) => handleGET(getForYearByPlayer, { params });
