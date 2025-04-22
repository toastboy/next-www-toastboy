import { buildJsonResponse, getUserRole, handleGET } from 'lib/api';
import { Player } from 'lib/types';
import { NextRequest } from 'next/server';
import playerService from 'services/Player';

async function buildResponse(data: Partial<Player>) {
    switch (await getUserRole()) {
        case 'none':
            data = {
                ...data,
                login: undefined,
                email: undefined,
                born: undefined,
                ...data.anonymous ? { firstName: undefined, lastName: undefined } : {},
                comment: undefined,
            };
            break;

        case 'user':
        case 'admin':
        default:
            break;
    }

    return buildJsonResponse(data);
}

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET<Partial<Player>>(() => playerService.getByIdOrLogin(params.idOrLogin), { params }, buildResponse);
};
