import PlayerMugshot from 'components/PlayerMugshot';
import playerService from "services/Player";
import PlayerForm from './PlayerForm';
import PlayerLink from './PlayerLink';

export default async function TeamPlayer({
    idOrLogin,
}: {
    idOrLogin: string,
}) {
    const id = await playerService.getId(idOrLogin);
    if (!id) {
        return null;
    }

    const player = await playerService.getById(id);
    if (!player) {
        return null;
    }

    return (
        <div className="w-[600px] rounded overflow-hidden shadow-lg" key={player.id}>
            <PlayerLink idOrLogin={player.login} />
            <PlayerMugshot player={player} />
            <PlayerForm player={player} games={10} />
        </div >
    );
}
