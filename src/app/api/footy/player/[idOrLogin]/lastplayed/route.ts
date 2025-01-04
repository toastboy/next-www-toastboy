import { handleGET } from 'lib/api';
import playerService from 'services/Player';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(async () => {
        const player = await playerService.getByIdOrLogin(params.idOrLogin);
        if (!player) { return null; }
        return playerService.getLastPlayed(player.id);
    }, { params });
};
