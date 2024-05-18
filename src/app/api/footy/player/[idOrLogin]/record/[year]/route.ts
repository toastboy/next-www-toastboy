import { handleGET } from 'lib/api';
import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export async function getForYearByPlayer(
    { params }: { params: Record<string, string> },
): Promise<Record<string, boolean | number | Date | string | null> | null> {
    const player = await playerService.getByIdOrLogin(params.idOrLogin);
    if (!player) return null;

    const record = await playerRecordService.getForYearByPlayer(parseInt(params.year), player.id);
    if (!record) return null;

    return { ...record, name: player.name };
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(getForYearByPlayer, { params });
