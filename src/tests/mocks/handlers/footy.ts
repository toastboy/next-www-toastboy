import { http, HttpResponse } from 'msw';

import { defaultOutcome } from '../data/outcome';
import { defaultPlayer } from '../data/player';

export const footyHandlers = [
    http.get('/api/footy/records/progress', () => {
        return HttpResponse.json([800, 2000]);
    }),
    http.get('/api/footy/player/:idOrLogin', ({ params }) => {
        const { idOrLogin } = params;
        return HttpResponse.json({ ...defaultPlayer, id: Number(idOrLogin) || defaultPlayer.id });
    }),
    http.get('/api/footy/player/:idOrLogin/lastplayed', () => {
        return HttpResponse.json(defaultOutcome);
    }),
];
