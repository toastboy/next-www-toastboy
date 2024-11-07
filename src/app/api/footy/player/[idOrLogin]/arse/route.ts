import { handleGET } from 'lib/api';
import arseService from 'services/Arse';
import playerService from 'services/Player';

export async function generateStaticParams() {
    const idsAndLogins = await playerService.getAllIdsAndLogins();
    return idsAndLogins.map((item: string) => ({
        idOrLogin: item,
    }));
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(async () => {
        const player = await playerService.getByIdOrLogin(params.idOrLogin);
        return player ? arseService.getByPlayer(player.id) : null;
    }, { params });
