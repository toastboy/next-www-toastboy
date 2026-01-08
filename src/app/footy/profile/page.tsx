
import { Notification } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { getCurrentUser } from '@/lib/authServer';
import clubService from '@/services/Club';
import clubSupporterService from '@/services/ClubSupporter';
import countryService from '@/services/Country';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';

interface PageProps {
    searchParams?: Promise<{
        purpose?: string;
        email?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const { purpose, email } = searchParams ?? {};
    const verifiedEmail = purpose === 'player_email' ? email : undefined;

    const user = await getCurrentUser();
    const playerId = user?.playerId;

    if (!user) return (<MustBeLoggedIn admin={false} />);

    if (!playerId) {
        return (
            <Notification icon={<IconX size={18} />} color="red">
                This account is not linked to a player profile yet.
            </Notification>
        );
    }

    const [player, emails, countries, clubs, allCountries, allClubs] = await Promise.all([
        playerService.getById(playerId),
        playerEmailService.getAll(playerId),
        countrySupporterService.getByPlayer(playerId),
        clubSupporterService.getByPlayer(playerId),
        countryService.getAll(),
        clubService.getAll(),
    ]);

    if (!player) {
        return (
            <Notification icon={<IconX size={18} />} color="red">
                Failed to load player profile.
            </Notification>
        );
    }

    return (
        <MustBeLoggedIn admin={false}>
            <PlayerProfileForm
                player={player}
                emails={emails}
                countries={countries}
                clubs={clubs}
                allCountries={allCountries}
                allClubs={allClubs}
                verifiedEmail={verifiedEmail}
            />
        </MustBeLoggedIn>
    );
};

export default Page;
