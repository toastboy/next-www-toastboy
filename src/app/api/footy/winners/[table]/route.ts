import { handleGET } from 'lib/api';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(() => playerRecordService.getWinners(
        params.table as EnumTable,
    ), { params });
};
