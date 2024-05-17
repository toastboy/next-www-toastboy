import playerService from 'services/Player';
import { handleGET } from '../../common';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => playerService.getByIdOrLogin(params.idOrLogin), { params });
