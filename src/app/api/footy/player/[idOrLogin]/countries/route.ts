import playerService from 'services/Player';
import counrtySupporterService from 'services/CountrySupporter';
import { handleGET } from 'app/api/footy/common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(async () => {
        const player = await playerService.getByIdOrLogin(params.idOrLogin);
        if (!player) { return null; }
        const data = await counrtySupporterService.getByPlayer(player.id);
        return data ? data.map((item) => item.countryISOcode) : null;
    }, { params });
