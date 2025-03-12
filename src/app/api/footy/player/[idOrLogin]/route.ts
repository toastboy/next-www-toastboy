import { handleGET } from 'lib/api';
import { Player } from 'lib/types';
import { NextRequest } from 'next/server';
import playerService from 'services/Player';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET<Player>(() => playerService.getByIdOrLogin(params.idOrLogin), { params });
};
