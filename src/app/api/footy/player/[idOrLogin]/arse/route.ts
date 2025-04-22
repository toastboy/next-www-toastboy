import { buildAdminOnlyResponse, handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import arseService from 'services/Arse';
import playerService from 'services/Player';

async function getArseByPlayerId(idOrLogin: string) {
    const player = await playerService.getByIdOrLogin(idOrLogin);
    return player ? arseService.getByPlayer(player.id) : null;
}

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => getArseByPlayerId(params.idOrLogin), { params }, buildAdminOnlyResponse);
};
