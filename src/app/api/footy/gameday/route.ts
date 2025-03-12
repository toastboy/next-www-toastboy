import { handleGET } from 'lib/api';
import { parseBoolean } from 'lib/utils';
import { NextRequest } from 'next/server';
import gameDayService from 'services/GameDay';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const searchParams = request.nextUrl.searchParams;

    return handleGET(() => gameDayService.getAll({
        bibs: searchParams.get('bibs') || undefined,
        game: parseBoolean(searchParams.get('game')),
        mailSent: parseBoolean(searchParams.get('mailSent')),
        year: parseInt(searchParams.get('year') || '') || undefined,
    }), { params });
};
