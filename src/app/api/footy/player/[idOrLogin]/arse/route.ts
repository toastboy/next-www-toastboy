import { handleGET } from 'lib/api';
import arseService from 'services/Arse';
import playerService from 'services/Player';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(async () => {
        const player = await playerService.getByIdOrLogin(params.idOrLogin);
        return player ? arseService.getByPlayer(player.id) : null;
    }, { params });
