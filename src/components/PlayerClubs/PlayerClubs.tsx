import ClubBadge from 'components/ClubBadge/ClubBadge';
import { Player } from 'lib/types';
import clubSupporterService from 'services/ClubSupporter';

export interface Props {
    player: Player;
}

const PlayerClubs: React.FC<Props> = async ({ player }) => {
    const data = await clubSupporterService.getByPlayer(player.id);

    if (!data) return <></>;

    return (
        // TODO: Change styles to use Mantine components
        <div className="px-6 py-4">
            {data.map((item) => (
                <ClubBadge key={item.clubId} club={item.club} />
            ))}
        </div>
    );
};

export default PlayerClubs;
