import playerService from 'services/Player';
import { getPlayer } from '../../common';
import prisma from 'lib/prisma';

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

    const data = await prisma.clubSupporter.findMany({
        where: {
            playerId: player.id,
        },
        include: {
            club: true,
        },
    });

    const clubs = data.map((item) => item.club.id);

    return new Response(JSON.stringify(clubs), {
        status: 200,
        headers: {
            'Content-Type': 'text/json',
        },
    });
}
