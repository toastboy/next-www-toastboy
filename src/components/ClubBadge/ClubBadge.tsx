import { Image } from '@mantine/core';
import { Club } from 'lib/types';

interface Props {
    club: Club,
}

const ClubBadge: React.FC<Props> = async ({ club }) => {
    return (
        <Image
            w="100%"
            h="100%"
            src={`/api/footy/club/${club.id}/badge`}
            alt={club.clubName}
            title={club.clubName}
        />
    );
};

export default ClubBadge;
