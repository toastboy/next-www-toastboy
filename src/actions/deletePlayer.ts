'use server';


import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { getCurrentUser } from '@/lib/authServer';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import emailVerificationService from '@/services/EmailVerification';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';

export async function deletePlayer() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('No authenticated user to delete');
    }

    // Mark account finished first, remove dependent records, then anonymise
    // player, and finally delete the auth user (so DB ops can complete while
    // user is still valid).

    await playerService.setFinished(user.playerId);

    await Promise.all([
        playerExtraEmailService.deleteAll(user.playerId),
        emailVerificationService.deleteAll(user.playerId),
        clubSupporterService.deleteAll(user.playerId),
        countrySupporterService.deleteAll(user.playerId),
    ]);

    await playerService.anonymise(user.playerId);

    await auth.api.deleteUser({
        body: { callbackURL: '/footy/auth/accountdeleted' },
        headers: await headers(),
    });
    // TODO: Delete the mugshot from storage if there is one
}
