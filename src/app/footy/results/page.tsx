import { notFound, permanentRedirect } from 'next/navigation';

import gameDayService from '@/services/GameDay';

async function ResultsPage() {
    const year = await gameDayService.getCurrentYear();
    if (!year) notFound();

    permanentRedirect(`/footy/games?year=${year}`);
};

export default ResultsPage;
