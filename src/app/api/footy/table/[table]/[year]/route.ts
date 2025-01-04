import { handleGET } from 'lib/api';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => playerRecordService.getTable(
        params.table as EnumTable,
        parseInt(params.year),
    ), { params });
};
