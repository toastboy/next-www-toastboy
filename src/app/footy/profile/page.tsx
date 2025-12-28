import { notFound } from 'next/navigation';

import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { getCurrentUser } from '@/lib/authServer';
import clubService from '@/services/Club';
import clubSupporterService from '@/services/ClubSupporter';
import countryService from '@/services/Country';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';

type PageProps = object

const Page: React.FC<PageProps> = async () => {
    const user = await getCurrentUser();
    const playerId = user?.playerId;

    if (!playerId) return notFound();

    const [player, emails, countries, clubs, allCountries, allClubs] = await Promise.all([
        playerService.getById(playerId),
        playerEmailService.getAll(playerId),
        countrySupporterService.getByPlayer(playerId),
        clubSupporterService.getByPlayer(playerId),
        countryService.getAll(),
        clubService.getAll(),
    ]);

    if (!player) return notFound();

    return (
        <MustBeLoggedIn admin={false}>
            <PlayerProfileForm
                player={player}
                emails={emails}
                countries={countries}
                clubs={clubs}
                allCountries={allCountries}
                allClubs={allClubs}
            />
        </MustBeLoggedIn>
    );
};

export default Page;
