import { handleGET } from 'lib/api';
import outcomeService from 'services/Outcome';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => outcomeService.getTurnoutByYear(), { params });
};
