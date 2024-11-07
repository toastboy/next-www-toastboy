import PlayerProfile from 'components/PlayerProfile';
import { notFound, redirect } from 'next/navigation';
import playerService from "services/Player";

export async function generateMetadata({
    params,
}: {
    params: Record<string, string>,
}) {
    try {
        const login = await playerService.getLogin(params.idOrLogin);
        if (!login) {
            return {};
        }
        const player = await playerService.getByLogin(login);
        if (!player) {
            return {};
        }
        const name = playerService.getName(player);
        return name ? {
            title: `${name}`,
        } : {};
    }
    catch (error) {
        throw new Error(`Getting player metadata: ${error}`);
    }
}

interface PageProps {
    params: Record<string, string>;
}

const Page: React.FC<PageProps> = async ({ params }) => {
    const login = await playerService.getLogin(params.idOrLogin);
    if (!login) return notFound();

    if (login != params.idOrLogin) {
        redirect(`/footy/player/${login}`);
    }

    const player = await playerService.getByLogin(login);
    if (!player) return notFound();

    return (
        <div>
            <main className="p-10 mx-auto max-w-4xl">
                <PlayerProfile player={player} key={player.id} />
            </main>

            <footer>
            </footer>
        </div>
    );
};

export default Page;
