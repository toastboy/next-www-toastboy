import { Image } from '@mantine/core';
import { ClubType } from 'prisma/generated/schemas/models/Club.schema';

export interface Props {
    club: ClubType;
}
const ClubBadge: React.FC<Props> = ({ club }) => {
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
