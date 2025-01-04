import { handleGET } from 'lib/api';
import outcomeService from 'services/Outcome';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => outcomeService.getByGameDay(
        parseInt(params.gameDay),
        params.team as 'A' | 'B',
    ), { params });
};
