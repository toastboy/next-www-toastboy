import { IconX } from '@tabler/icons-react';

import { updatePlayer } from '@/actions/updatePlayer';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { PlayerProfileForm } from '@/components/PlayerProfileForm/PlayerProfileForm';
import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
import { getCurrentUser } from '@/lib/auth.server';
import { config } from '@/lib/config';
import clubService from '@/services/Club';
import clubSupporterService from '@/services/ClubSupporter';
import countryService from '@/services/Country';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Profile' };

const Page = async () => {
    const user = await getCurrentUser();
    const playerId = user?.playerId;

    if (!playerId) {
        return (
            <StatusNotification
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
                message="This account is not linked to a player profile yet."
            />
        );
    }

    const [player, extraEmails, countries, clubs, allCountries, allClubs] =
        await Promise.all([
            playerService.getById(playerId),
            playerExtraEmailService.getAll(playerId),
            countrySupporterService.getByPlayer(playerId),
            clubSupporterService.getByPlayer(playerId),
            countryService.getAll(),
            clubService.getAll(),
        ]);

    if (!player) {
        return (
            <StatusNotification
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
                message="Failed to load player profile."
            />
        );
    }

    return (
        <>
            <AutoRefresh channels={FootyChannel.Players} />
            <PlayerProfileForm
                player={player}
                accountEmail={user.email}
                extraEmails={extraEmails}
                countries={countries}
                clubs={clubs}
                allCountries={allCountries}
                allClubs={allClubs}
                onUpdatePlayer={updatePlayer}
            />
        </>
    );
};

export default Page;
