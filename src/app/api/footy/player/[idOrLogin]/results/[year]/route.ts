import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';
import { getPlayer } from '../../../common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export async function GET(
    request: Request,
    { params }: {
        params: {
            idOrLogin: string,
            year: string,
        }
    },
) {
    try {
        const player = await getPlayer(params.idOrLogin);
        if (!player) {
            return new Response(`Player ${params.idOrLogin} not found`, {
                status: 404,
            });
        }

        const record = await playerRecordService.getForYearByPlayer(parseInt(params.year), player.id);
        if (!record) {
            return new Response(`Player ${params.idOrLogin} not found`, {
                status: 404,
            });
        }

        return new Response(JSON.stringify(record), {
            status: 200,
            headers: {
                'Content-Type': 'text/json',
            },
        });
    }
    catch (error) {
        console.error(`Error im API route: ${error} `);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}
