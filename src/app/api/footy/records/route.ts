import playerRecordService from 'services/PlayerRecord';
import { handleGET } from '../common';

async function getAllPlayerRecords() {
    return await playerRecordService.getAll();
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(getAllPlayerRecords, { params });
