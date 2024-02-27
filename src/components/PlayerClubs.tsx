import { player } from '@prisma/client';
import clubSupporterService from 'services/club_supporter';
import clubService from 'services/club';
import ClubBadge from 'components/ClubBadge';

export default async function PlayerClubs({
    player,
}: {
    player: player,
}) {
    const club_supporters = await clubSupporterService.getByPlayer(player.id);

    if (club_supporters.length === 0) {
        return null;
    }

    const clubs = await Promise.all(club_supporters.map(async (item) => {
        const club = await clubService.get(item.clubId);
        return club;
    }));


    return (
        <div className="px-6 py-4">
            {clubs.map((item) => (
                <ClubBadge key={item.id} club={item} />
            ))}
        </div>
    );
}
