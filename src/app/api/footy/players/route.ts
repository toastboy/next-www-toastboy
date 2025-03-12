import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import playerService from 'services/Player';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => playerService.getAll(), { params });
};
