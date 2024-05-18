import { handleGET } from 'lib/api';
import playerService from 'services/Player';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(async () => {
        const player = await playerService.getByIdOrLogin(params.idOrLogin);
        if (!player) { return null; }
        return playerService.getLastPlayed(player.id);
    }, { params });
