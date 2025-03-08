import { Flex } from '@mantine/core';
import ClubBadge from 'components/ClubBadge/ClubBadge';
import { fetchData } from 'lib/fetch';
import { ClubSupporterWithClub, Player } from 'lib/types';

export interface Props {
    player: Player;
}

const PlayerClubs: React.FC<Props> = async ({ player }) => {
    const clubs = await fetchData<ClubSupporterWithClub[]>(`/api/footy/player/${player.id}/clubs`);

    if (!clubs || clubs.length == 0) return <></>;

    return (
        <Flex gap="xs" p="xs" direction="column">
            {clubs.map((item) => (
                <ClubBadge key={item.clubId} club={item.club} />
            ))}
        </Flex>
    );
};

export default PlayerClubs;
