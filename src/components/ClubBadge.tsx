import { Image, Loader } from '@mantine/core';
import { useClub } from 'use/club';

export default function ClubBadge({ clubId }: { clubId: number }) {
    const { data: club, error, isLoading } = useClub(clubId);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;

    return (
        <Image
            className="w-full"
            width={150}
            height={150}
            src={`/api/footy/club/${clubId}/badge`}
            alt={club.club_name}
            title={club.club_name}
        />
    );
}
