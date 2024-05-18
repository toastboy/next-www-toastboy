import playerRecordService from 'services/PlayerRecord';
import { handleGET } from 'lib/api';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => playerRecordService.getProgress(), { params });
