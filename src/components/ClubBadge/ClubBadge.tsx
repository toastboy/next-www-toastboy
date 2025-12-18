import { Image } from '@mantine/core';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';

export interface Props {
    club: ClubType;
}
export const ClubBadge: React.FC<Props> = ({ club }) => {
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
