import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import gameDayService from 'services/GameDay';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const searchParams = request.nextUrl.searchParams;
    // TODO: Decide whether I want to use searchParams instead of optional route parameters
    const untilGameDayId = searchParams.get('untilGameDayId');

    return handleGET(() => {
        return gameDayService.getGamesPlayed(parseInt(params.year), untilGameDayId ? parseInt(untilGameDayId) : undefined);
    }, { params });
};
