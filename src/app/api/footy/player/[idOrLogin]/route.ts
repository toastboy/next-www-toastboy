import { handleGET } from 'lib/api';
import { Player } from 'lib/types';
import playerService from 'services/Player';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET<Player>(() => playerService.getByIdOrLogin(params.idOrLogin), { params });
};
