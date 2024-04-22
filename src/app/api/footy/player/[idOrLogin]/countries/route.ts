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

    const data = await prisma.countrySupporter.findMany({
        where: {
            playerId: player.id,
        },
        include: {
            country: true,
        },
    });

    const countries = data.map((item) => item.country.isoCode);

    return new Response(JSON.stringify(countries), {
        status: 200,
        headers: {
            'Content-Type': 'text/json',
        },
    });
}
