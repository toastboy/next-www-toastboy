import { notFound, redirect } from 'next/navigation';

import gameDayService from '@/services/GameDay';

export const metadata = { title: 'Drinkers' };

const DrinkersPage = async () => {
    const currentGame = await gameDayService.getCurrent();
    if (!currentGame) return notFound();

    redirect(`/footy/admin/drinkers/${currentGame.id}`);
};

export default DrinkersPage;
