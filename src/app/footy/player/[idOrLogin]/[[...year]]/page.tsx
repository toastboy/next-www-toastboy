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
        throw new Error(`Getting player metadata: ${String(error)}`);
    }
}

const Page: React.FC<Props> = async props => {
    const { idOrLogin, year } = await props.params;
    const yearNum = year ? parseInt(year[0]) : 0;
    const player = await playerService.getByIdOrLogin(idOrLogin);

    if (!player) return notFound();

    if (player.id.toString() != idOrLogin) {
        redirect(`/footy/player/${player.id}`);
    }

    const lastPlayed = await playerService.getLastPlayed(player.id, yearNum);
    const gameDayId = lastPlayed ? lastPlayed.gameDayId : 0;
    const form = await playerService.getForm(player.id, gameDayId, yearNum);

    return (
        <PlayerProfile
            key={player.id}
            player={player}
            year={yearNum}
            form={form}
            lastPlayed={lastPlayed}
        />
    );
};

export default Page;
