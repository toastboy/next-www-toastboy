import { notFound, redirect } from 'next/navigation';

import { playerService } from "lib/player";

import PlayerProfile from 'components/PlayerProfile';

export async function generateMetadata({
    params,
}: {
    params: { idOrLogin: string },
}) {
    try {
        // TODO: Error checking
        const login = await playerService.getLogin(params.idOrLogin);
        const player = await playerService.getByLogin(login);
        const name = playerService.getName(player);
        return {
            title: `${name}`,
        };
    }
    catch (error) {
        throw new Error("Getting player metadata: ", error);
    }
}

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export default async function Page({
    params,
}: {
    params: { idOrLogin: string },
})
    : Promise<JSX.Element> {
    const login = await playerService.getLogin(params.idOrLogin);

    if (!login) {
        return notFound();
    }

    if (login != params.idOrLogin) {
        redirect(`/footy/player/${login}`);
    }

    const player = await playerService.getByLogin(login);

    if (!player) {
        return notFound();
    }

    return (
        <div>
            <main className="p-10 mx-auto max-w-4xl">
                <PlayerProfile player={player} key={player.id} />
            </main>

            <footer>
            </footer>
        </div>
    );
}