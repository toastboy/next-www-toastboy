import { Image } from '@mantine/core';
import { Club } from 'lib/types';

interface Props {
    club: Club,
}

const ClubBadge: React.FC<Props> = async ({ club }) => {
    return (
        <Image
            className="w-full"
            width={150}
            height={150}
            src={`/api/footy/club/${club.id}/badge`}
            alt={club.clubName}
            title={club.clubName}
        />
    );
};

export default ClubBadge;
