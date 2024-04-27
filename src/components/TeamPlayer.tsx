import PlayerMugshot from 'components/PlayerMugshot';
import PlayerForm from 'components/PlayerForm';
import PlayerLink from 'components/PlayerLink';

export default async function TeamPlayer({
    idOrLogin,
    goalie,
}: {
    idOrLogin: string;
    goalie: boolean | null;
}) {
    return (
        <div className="w-[600px] rounded overflow-hidden shadow-lg" key={idOrLogin}>
            <PlayerLink idOrLogin={idOrLogin} />
            <PlayerMugshot idOrLogin={idOrLogin} />
            <PlayerForm idOrLogin={idOrLogin} games={10} />
            <p>{goalie ? "GOALIE!" : ""}</p>
        </div>
    );
}
