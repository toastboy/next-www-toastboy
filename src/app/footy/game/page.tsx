export const dynamic = 'force-dynamic';

import { notFound, redirect } from 'next/navigation';

import gameDayService from '@/services/GameDay';

const Page = async () => {
    const currentGame = await gameDayService.getCurrent();
    if (!currentGame) return notFound();
    redirect(`/footy/game/${currentGame.id}`);
};

export default Page;
