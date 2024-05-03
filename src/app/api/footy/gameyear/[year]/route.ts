import gameDayService from 'services/GameDay';
import { handleGET } from '../../common';

async function getGameYear(
    { params }: { params: Record<string, string> },
) {
    return await gameDayService.getYear(parseInt(params.year));
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(getGameYear, { params });
