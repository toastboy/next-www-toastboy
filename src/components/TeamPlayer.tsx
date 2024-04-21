import PlayerMugshot from 'components/PlayerMugshot';
import playerService from "services/Player";
import PlayerForm from './PlayerForm';
import PlayerLink from './PlayerLink';
import { Outcome } from '@prisma/client';

export default async function TeamPlayer({
    idOrLogin,
    outcome,
}: {
    idOrLogin: string,
    outcome: Outcome,
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
            <PlayerMugshot idOrLogin={player.login} />
            <PlayerForm player={player} games={10} />
            <p>{outcome.goalie ? "GOALIE!" : ""}</p>
        </div >
    );
}
