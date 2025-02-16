import { Image, Loader } from '@mantine/core';
import { useClub } from 'lib/swr';

interface ClubBadgeProps {
    clubId: number;
}

const ClubBadge: React.FC<ClubBadgeProps> = ({ clubId }) => {
    const { data: club, error, isLoading } = useClub(clubId);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !club) return <div>failed to load</div>;

    return (
        <Image
            className="w-full"
            width={150}
            height={150}
            src={`/api/footy/club/${clubId}/badge`}
            alt={club.clubName}
            title={club.clubName}
        />
    );
};

export default ClubBadge;
