import playerService from 'services/Player';
import { getPlayer } from '../../../common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export async function GET(
    request: Request,
    { params }: {
        params: {
            idOrLogin: string,
            games: string,
        }
    },
) {
    const player = await getPlayer(params.idOrLogin);
    if (!player) {
        return new Response(`Player ${params.idOrLogin} not found`, {
            status: 404,
        });
    }

    const outcomes = await playerService.getForm(player.id, 0, parseInt(params.games));
    if (!outcomes) {
        return new Response(`Player ${params.idOrLogin} not found`, {
            status: 404,
        });
    }

    return new Response(JSON.stringify(outcomes), {
        status: 200,
        headers: {
            'Content-Type': 'text/json',
        },
    });
}
