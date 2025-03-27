import { Player } from '@prisma/client';
import PlayerProfile from 'components/PlayerProfile/PlayerProfile';
import { fetchData, parsePlayer } from 'lib/fetch';
import { notFound, redirect } from 'next/navigation';

interface Props {
    params: Promise<{
        idOrLogin: string,
        year: [string],
    }>,
}

export async function generateMetadata(props: Props) {
    try {
        const { idOrLogin } = await props.params;
        const name = await fetchData<string>(`/api/footy/player/${idOrLogin}/name`);
        return name ? { title: `${name}` } : {};
    }
    catch (error) {
        throw new Error(`Getting player metadata: ${error}`);
    }
}

const Page: React.FC<Props> = async props => {
    const { idOrLogin, year } = await props.params;
    const yearNum = year ? parseInt(year[0]) : 0; // Zero or undefined means all-time
    const player = parsePlayer(await fetchData<Player>(`/api/footy/player/${idOrLogin}`));

    if (!player) return notFound();

    if (player.login != idOrLogin) {
        redirect(`/footy/player/${player.login}`);
    }

    return (
        <PlayerProfile player={player} key={player.id} year={yearNum} />
    );
};

export default Page;
