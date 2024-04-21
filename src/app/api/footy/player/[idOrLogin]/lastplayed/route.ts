import playerService from 'services/Player';
import { getPlayer } from '../../common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export async function GET(
    request: Request,
    { params }: {
        params: {
            idOrLogin: string
        }
    },
) {
    const player = await getPlayer(params.idOrLogin);
    if (!player) {
        return new Response(`Player ${params.idOrLogin} not found`, {
            status: 404,
        });
    }

    const outcome = await playerService.getLastPlayed(player.id);
    if (!outcome) {
        return new Response(`Player ${params.idOrLogin} not found`, {
            status: 404,
        });
    }

    return new Response(JSON.stringify(outcome), {
        status: 200,
        headers: {
            'Content-Type': 'text/json',
        },
    });
}
