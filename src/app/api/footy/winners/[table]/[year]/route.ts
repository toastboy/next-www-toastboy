import { handleGET } from 'lib/api';
import { TableName } from 'lib/types';
import playerRecordService from 'services/PlayerRecord';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => playerRecordService.getWinners(
        params.table as TableName,
        params.year != undefined ? parseInt(params.year) : undefined,
    ), { params });
};
