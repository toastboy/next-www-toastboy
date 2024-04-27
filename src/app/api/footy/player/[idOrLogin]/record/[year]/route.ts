import playerService from 'services/Player';
import { getPlayer } from '../../../common';
import { handleGET } from 'app/api/footy/common';
import prisma from 'lib/prisma';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export async function getForYearByPlayer(
    { params }: { params: Record<string, string> },
): Promise<Record<string, boolean | number | Date | string | null> | null> {
    const player = await getPlayer(params.idOrLogin);
    if (!player) {
        return null;
    }

    const record = await prisma.playerRecord.findFirst({
        where: {
            year: parseInt(params.year),
            playerId: player.id,
        },
        orderBy: {
            gameDayId: 'desc',
        },
    });
    if (!record) {
        return null;
    }

    return { ...record, name: player.name };
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(getForYearByPlayer, { params });
