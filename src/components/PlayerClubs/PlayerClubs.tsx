import { Flex } from '@mantine/core';
import ClubBadge from 'components/ClubBadge/ClubBadge';
import { Player } from 'lib/types';
import clubSupporterService from 'services/ClubSupporter';

export interface Props {
    player: Player;
}

const PlayerClubs: React.FC<Props> = async ({ player }) => {
    const data = await clubSupporterService.getByPlayer(player.id);

    if (!data || data.length == 0) return <></>;

    return (
        <Flex gap="xs" p="xs" direction="column">
            {data.map((item) => (
                <ClubBadge key={item.clubId} club={item.club} />
            ))}
        </Flex>
    );
};

export default PlayerClubs;
