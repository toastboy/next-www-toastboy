import gameDayService from 'services/GameDay';
import { handleGET } from 'lib/api';

export const GET = (request: Request, { params }: { params: Record<string, string> }) =>
    handleGET(() => {
        if (parseInt(params.year) === 0) return Promise.resolve(true);
        return gameDayService.getYear(parseInt(params.year)).then((year) => Promise.resolve(year == parseInt(params.year) ? true : null));
    }, { params });
