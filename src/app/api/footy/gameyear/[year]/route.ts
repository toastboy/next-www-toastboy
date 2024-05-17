import gameDayService from 'services/GameDay';
import { handleGET } from '../../common';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => gameDayService.getYear(parseInt(params.year)), { params });
