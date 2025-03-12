import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import outcomeService from 'services/Outcome';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => outcomeService.getTurnout(
        params.gameDayId != undefined ? parseInt(params.gameDayId) : undefined,
    ), { params });
};
