import { Flex } from '@mantine/core';
import ClubBadge from 'components/ClubBadge/ClubBadge';
import clubSupporterService from 'services/ClubSupporter';

export interface Props {
    playerId: number;
}

const PlayerClubs: React.FC<Props> = async ({ playerId }) => {
    const clubs = await clubSupporterService.getByPlayer(playerId);

    if (!clubs || clubs.length === 0) return <></>;

    return (
        <Flex gap="xs" p="xs" direction="column">
            {await Promise.all(clubs.map((item) => (
                <ClubBadge key={item.clubId} clubId={item.clubId} />
            )))}
        </Flex>
    );
};

export default PlayerClubs;
