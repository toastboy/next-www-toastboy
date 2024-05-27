import { handleGET } from 'lib/api';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => playerRecordService.getWinners(
        params.table as EnumTable,
        params.year != undefined ? parseInt(params.year) : undefined,
    ), { params });
