import { handleGET } from 'lib/api';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => playerRecordService.getTable(
        params.table as EnumTable,
        parseInt(params.year),
    ), { params });
