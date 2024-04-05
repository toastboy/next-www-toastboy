import Link from 'next/link';
import playerService from 'services/Player';

export default async function PlayerLink({ idOrLogin }: { idOrLogin: string }) {
    const id = await playerService.getId(idOrLogin);
    if (!id) {
        return null;
    }

    const player = await playerService.getById(id);
    if (!player) {
        return null;
    }

    return (
        <Link className="text-gray-700 text-base" href={'/footy/player/' + player.login} >
            {playerService.getName(player)}
        </Link>
    );
}
