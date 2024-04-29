import { handleGET } from 'app/api/footy/common';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export async function getTable(
    { params }: { params: Record<string, string> },
) {
    return await playerRecordService.getTable(
        params.table as EnumTable,
        parseInt(params.year),
        params.qualified === 'true',
        parseInt(params.take),
    );
}

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(getTable, { params });
