import { handleGET } from 'lib/api';
import outcomeService from 'services/Outcome';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => outcomeService.getTurnout(), { params });
