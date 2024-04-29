import { handleGET } from 'app/api/footy/common';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export async function getWinners(
    { params }: { params: Record<string, string> },
) {
    return await playerRecordService.getWinners(params.table as EnumTable, parseInt(params.year));
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(getWinners, { params });
