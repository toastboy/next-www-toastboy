import { notFound, redirect } from 'next/navigation';

import { getLogin, getByLogin, getAllIdsAndLogins } from 'lib/players';

import PlayerProfile from 'components/PlayerProfile';

export async function generateMetadata({
    params,
}: {
    params: { idOrLogin: string },
}) {
    return {
        title: "idOrLogin: " + params.idOrLogin.toString(),
    };
}

export async function generateStaticParams() {
    return getAllIdsAndLogins();
}

export default async function Page({
    params,
}: {
    params: { idOrLogin: string },
})
    : Promise<JSX.Element> {
    const login = await getLogin(params.idOrLogin);

    if (login != params.idOrLogin) {
        redirect("/footy/player/" + login);
    }

    const player = await getByLogin(login);

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
