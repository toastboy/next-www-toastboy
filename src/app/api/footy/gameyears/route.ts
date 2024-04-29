import gameDayService from 'services/GameDay';
import { handleGET } from '../common';

async function getAllYears() {
    return await gameDayService.getAllYears();
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(getAllYears, { params });
