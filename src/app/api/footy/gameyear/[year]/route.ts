import gameDayService from 'services/GameDay';
import { handleGET } from 'lib/api';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => gameDayService.getYear(parseInt(params.year)), { params });
