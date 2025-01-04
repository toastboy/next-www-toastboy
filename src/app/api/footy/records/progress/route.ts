import playerRecordService from 'services/PlayerRecord';
import { handleGET } from 'lib/api';

export const GET = async (request: Request, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(() => playerRecordService.getProgress(), { params });
};
