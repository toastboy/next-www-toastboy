import { notFound } from 'next/navigation';

import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { getCurrentUser } from '@/lib/authServer';
import clubService from '@/services/Club';
import countryService from '@/services/Country';
import playerService from '@/services/Player';

type PageProps = object

const Page: React.FC<PageProps> = async () => {
    const user = await getCurrentUser();
    const playerId = user?.playerId;

    if (!playerId) return notFound();

    const [player, emails, allCountries, allClubs] = await Promise.all([
        playerService.getById(playerId),
        playerService.getAllEmails(playerId),
        countryService.getAll(),
        clubService.getAll(),
    ]);

    if (!player) return notFound();

    return (
        <MustBeLoggedIn admin={false}>
            <PlayerProfileForm
                player={player}
                emails={emails}
                allCountries={allCountries}
                allClubs={allClubs}
            />
        </MustBeLoggedIn>
    );
};

export default Page;
