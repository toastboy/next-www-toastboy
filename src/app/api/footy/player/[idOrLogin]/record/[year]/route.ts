import { handleGET } from 'lib/api';
import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';

export async function getForYearByPlayer(
    { params }: { params: Record<string, string> },
) {
    const player = await playerService.getByIdOrLogin(params.idOrLogin);
    if (!player) return null;

    return await playerRecordService.getForYearByPlayer(parseInt(params.year), player.id);
}

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(getForYearByPlayer, { params });
};
