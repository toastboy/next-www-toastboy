import { notFound, permanentRedirect } from 'next/navigation';

import gameDayService from '@/services/GameDay';

async function ResultsPage() {
    const currentGame = await gameDayService.getCurrent();
    if (!currentGame) notFound();
    const year = new Date(currentGame.date).getFullYear();

    permanentRedirect(`/footy/games?year=${year}`);
};

export default ResultsPage;
