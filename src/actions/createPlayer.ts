'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import prisma from 'prisma/prisma';

import { auth } from '@/lib/auth';
import { getSecrets } from '@/lib/secrets';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';
import { CreatePlayerSchema } from '@/types/CreatePlayerInput';

/**
 * Creates a new player in the system with the provided data.
 *
 * @param rawData - The raw player data to be validated and processed. Must conform to CreatePlayerSchema.
 * @returns A promise that resolves to the created player object.
 * @throws {Error} When the introducedBy value is provided but not a valid number.
 * @throws {ZodError} When the rawData does not match the CreatePlayerSchema validation.
 *
 * @remarks
 * This function performs the following operations:
 * - Validates the input data against CreatePlayerSchema
 * - Trims whitespace from name and introducedBy fields
 * - Converts introducedBy to a number or null
 * - Creates a new player with the current date as joined date
 * - Revalidates the newplayer and players pages
 */
export async function createPlayer(rawData: unknown) {
    const data = CreatePlayerSchema.parse(rawData);
    const name = data.name.trim();
    const introducedBy = data.introducedBy.trim();
    const introducedById = introducedBy ? Number(introducedBy) : null;

    if (introducedBy && Number.isNaN(introducedById)) {
        throw new Error('Introducer must be a number.');
    }

    const player = await playerService.create({
        name,
        introducedBy: introducedById,
        joined: new Date(),
    });

    // It's possible to have a player profile with no email: responses will have
    // to be entered manually for them.
    if (data.email && data.email.length > 0) {
        const email = data.email.trim().toLowerCase();
        const existingPlayerEmail = await playerEmailService.getByEmail(email);
        if (existingPlayerEmail && existingPlayerEmail.playerId !== player.id) {
            throw new Error('Email address already belongs to another player.');
        }

        if (!existingPlayerEmail) {
            await playerEmailService.create({
                playerId: player.id,
                email,
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    id: crypto.randomUUID(),
                    email,
                    name,
                    emailVerified: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        } else if (existingUser.emailVerified) {
            await playerEmailService.upsert(player.id, email, true);
        }

        if (!existingUser?.emailVerified) {
            const secrets = getSecrets();
            const callbackURL = new URL('/footy/auth/claim', secrets.BETTER_AUTH_URL).toString();
            await auth.api.sendVerificationEmail({
                body: {
                    email,
                    callbackURL,
                },
            });
        }
    }

    revalidatePath('/footy/newplayer');
    revalidatePath('/footy/players');

    return {
        player,
    };
}
