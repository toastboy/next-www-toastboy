import gameDayService from 'services/GameDay';
import { handleGET } from '../common';

async function getAllYears(): Promise<string | null> {
    const record = await gameDayService.getAllYears();
    if (!record) {
        return null;
    }

    return JSON.stringify(record);
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) => handleGET(getAllYears, { params });
