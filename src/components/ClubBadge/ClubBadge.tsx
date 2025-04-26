import { Image } from '@mantine/core';
import clubService from 'services/Club';

interface Props {
    clubId: number,
}

const ClubBadge: React.FC<Props> = async ({ clubId }) => {
    const club = await clubService.get(clubId);

    if (!club) return <></>;

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
