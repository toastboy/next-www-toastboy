import { Player } from '@prisma/client';
import PlayerProfile from 'components/PlayerProfile/PlayerProfile';
import { fetchData } from 'lib/fetch';
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

interface Props {
    params: Promise<{
        idOrLogin: string,
        year: [string],
    }>,
}

const Page: React.FC<Props> = async props => {
    const { idOrLogin, year } = await props.params;
    const yearnum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const player = await fetchData<Player>(`/api/footy/player/${idOrLogin}`);

    if (!player) return notFound();

    if (player.login != idOrLogin) {
        redirect(`/footy/player/${player.login}`);
    }

    const validatedPlayer = playerService.validate(player);

    return (
        <PlayerProfile player={validatedPlayer} key={player.id} year={yearnum} />
    );
};

export default Page;
