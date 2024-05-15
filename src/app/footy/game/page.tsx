import { notFound, redirect } from 'next/navigation';
import gameDayService from 'services/GameDay';

export default async function Page() {
    const gameDay = await gameDayService.getCurrent();

    if (gameDay) {
        redirect(`/footy/game/${gameDay.id}`);
    }
    else {
        return notFound();
    }
}
