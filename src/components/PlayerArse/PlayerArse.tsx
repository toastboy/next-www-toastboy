import { Player } from 'lib/types';
import arseService from 'services/Arse';

export interface Props {
    player: Player,
}

const PlayerArse: React.FC<Props> = async ({ player }) => {
    const arse = await arseService.getByPlayer(player.id);

    return (
        // TODO: Change styles to use Mantine components
        <div className="px-6 py-4">
            <p className="text-gray-700 text-base">In Goal: {arse?.inGoal}</p>
            <p className="text-gray-700 text-base">Running: {arse?.running}</p>
            <p className="text-gray-700 text-base">Shooting: {arse?.shooting}</p>
            <p className="text-gray-700 text-base">Passing: {arse?.passing}</p>
            <p className="text-gray-700 text-base">Ball Skill: {arse?.ballSkill}</p>
            <p className="text-gray-700 text-base">Attacking: {arse?.attacking}</p>
            <p className="text-gray-700 text-base">Defending: {arse?.defending}</p>
        </div>
    );
};

export default PlayerArse;
