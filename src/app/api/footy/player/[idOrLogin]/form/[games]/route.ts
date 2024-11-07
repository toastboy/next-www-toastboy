import { handleGET } from 'lib/api';
import playerService from 'services/Player';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(async () => {
        const player = await playerService.getByIdOrLogin(params.idOrLogin);
        if (!player) { return null; }
        return playerService.getForm(player.id, 0, parseInt(params.games));
    }, { params });
