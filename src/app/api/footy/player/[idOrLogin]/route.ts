import { handleGET } from 'lib/api';
import playerService from 'services/Player';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => playerService.getByIdOrLogin(params.idOrLogin), { params });
