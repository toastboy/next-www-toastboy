import { handleGET } from 'lib/api';
import { TableName } from 'lib/types';
import playerRecordService from 'services/PlayerRecord';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => playerRecordService.getTable(
        params.table as TableName,
        parseInt(params.year),
        params.qualified === 'true',
        parseInt(params.take),
    ), { params });
};
