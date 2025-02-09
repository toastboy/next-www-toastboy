import PlayerProfile from 'components/PlayerProfile/PlayerProfile';
import { notFound, redirect } from 'next/navigation';
import playerService from "services/Player"; // TODO: use API, not service directly

export async function generateMetadata(
    props: {
        params: Promise<{ idOrLogin: string }>,
    },
) {
    try {
        const { idOrLogin } = await props.params;
        const login = await playerService.getLogin(idOrLogin);
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
    params: Promise<{ idOrLogin: string }>,
}

const Page: React.FC<PageProps> = async props => {
    const { idOrLogin } = await props.params;
    const login = await playerService.getLogin(idOrLogin);

    if (!login) return notFound();

    if (login != idOrLogin) {
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
