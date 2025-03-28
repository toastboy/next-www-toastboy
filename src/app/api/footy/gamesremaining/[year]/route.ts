import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import gameDayService from 'services/GameDay';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => {
        return gameDayService.getGamesRemaining(parseInt(params.year));
    }, { params });
};
