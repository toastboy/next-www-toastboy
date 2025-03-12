import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import outcomeService from 'services/Outcome';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => outcomeService.getByGameDay(
        parseInt(params.gameDay),
        params.team as 'A' | 'B',
    ), { params });
};
