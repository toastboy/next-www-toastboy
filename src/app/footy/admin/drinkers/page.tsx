import { notFound, redirect } from 'next/navigation';

import gameDayService from '@/services/GameDay';

type PageProps = object;

const Page: React.FC<PageProps> = async () => {
    const currentGame = await gameDayService.getCurrent();
    if (!currentGame) return notFound();

    redirect(`/footy/admin/drinkers/${currentGame.id}`);
};

export default Page;
