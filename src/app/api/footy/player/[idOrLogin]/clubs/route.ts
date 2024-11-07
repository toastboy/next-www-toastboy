import { handleGET } from 'lib/api';
import clubSupporterService from 'services/ClubSupporter';
import playerService from 'services/Player';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(async () => {
        const player = await playerService.getByIdOrLogin(params.idOrLogin);
        if (!player) { return null; }
        const data = await clubSupporterService.getByPlayer(player.id);
        return data ? data.map((item) => item.clubId) : null;
    }, { params });
