import { handleGET } from 'app/api/footy/common';
import outcomeService from 'services/Outcome';

export async function getGameDayOutcomes(
    { params }: { params: Record<string, string> },
) {
    return await outcomeService.getByGameDay(parseInt(params.gameDay), params.team as 'A' | 'B');
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(getGameDayOutcomes, { params });
