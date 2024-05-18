import { handleGET } from 'lib/api';
import outcomeService from 'services/Outcome';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => outcomeService.getByGameDay(
        parseInt(params.gameDay),
        params.team as 'A' | 'B',
    ), { params });
