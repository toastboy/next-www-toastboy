import { handleGET } from 'app/api/footy/common';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => playerRecordService.getTable(
        params.table as EnumTable,
        parseInt(params.year),
    ), { params });
