import { notFound, redirect } from 'next/navigation';
import gameDayService from 'services/GameDay'; // TODO: use API, not service directly

type PageProps = object

const Page: React.FC<PageProps> = async () => {
    const gameDay = await gameDayService.getCurrent();

    if (gameDay) {
        redirect(`/footy/game/${gameDay.id}`);
    }
    else {
        return notFound();
    }
};

export default Page;
