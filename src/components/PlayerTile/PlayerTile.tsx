import { Anchor } from '@mantine/core';
import { Player } from '@prisma/client';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';

interface PlayerTileProps {
  player: Player;
}

const PlayerTile: React.FC<PlayerTileProps> = ({ player }) => {
  const { id, login, firstName, lastName, email, born } = player;
  const born_string = born == null ? "Unknown" : born.toLocaleDateString('sv');

  return (
    // TODO: Replace styles with Mantine ones
    <div className="w-[250px] rounded overflow-hidden shadow-lg" key={id}>
      <PlayerMugshot player={player} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2"><Anchor href={"/footy/player/" + login}>{firstName} {lastName}</Anchor></div>
        <Anchor href={"/footy/player/" + login} className="block text-gray-700 text-base">{email}</Anchor>
        <Anchor href={"/footy/player/" + login} className="block text-gray-900 text-xl">{login}</Anchor>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {born_string}
        </span>
      </div>
    </div>
  );
};

export default PlayerTile;
