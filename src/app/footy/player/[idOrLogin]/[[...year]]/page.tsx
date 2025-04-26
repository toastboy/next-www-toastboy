import PlayerProfile from 'components/PlayerProfile/PlayerProfile';
import { notFound, redirect } from 'next/navigation';
import playerService from 'services/Player';

interface Props {
    params: Promise<{
        idOrLogin: string,
        year: [string],
    }>,
}

export async function generateMetadata(props: Props) {
    try {
        const { idOrLogin } = await props.params;
        const player = await playerService.getByIdOrLogin(idOrLogin);
        if (!player) return {};
        const name = playerService.getName(player);
        return name ? { title: `${name}` } : {};
    }
    catch (error) {
        throw new Error(`Getting player metadata: ${error}`);
    }
}

const Page: React.FC<Props> = async props => {
    const { idOrLogin, year } = await props.params;
    const yearNum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const player = await playerService.getByIdOrLogin(idOrLogin);

    if (!player) return notFound();

    if (player.id.toString() != idOrLogin) {
        redirect(`/footy/player/${player.id}`);
    }

    return (
        <PlayerProfile player={player} key={player.id} year={yearNum} />
    );
};

export default Page;
