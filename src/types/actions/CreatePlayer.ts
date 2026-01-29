import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { z } from 'zod';

export const CreatePlayerSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.preprocess(
        (value) => {

            return typeof value === 'string' ? value.trim().toLowerCase() : value;
        },
        z.union([
            z.email({ message: 'Invalid email' }),
            z.literal(''),
        ]),
    ),
    introducedBy: z.string(),
});

export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;

/**
 * Schema for adding a player invite.
 * Validates the email address to ensure correctness before invoking the action.
 */
export const AddPlayerInviteSchema = z.object({
    email: z.email({ message: 'Invalid email' }),
});

/**
 * Input type for the add player invite action.
 * Wraps the required data for validation and typing.
 */
export type AddPlayerInviteInput = z.infer<typeof AddPlayerInviteSchema>;

/**
 * Server action proxy type for the addPlayerInvite action.
 * Allows components to accept a custom implementation without directly importing the real action,
 * making them testable and Storybook-friendly.
 *
 * @param playerId - The ID of the player to invite
 * @param email - The invitee's email address
 * @returns Promise resolving to the generated invite link
 */
export type AddPlayerInviteProxy = (
    playerId: number,
    email: string,
) => Promise<string>;

/**
 * Server action proxy type for the createPlayer action.
 * Accepts validated `CreatePlayerInput` and returns the created player
 * alongside the invitation link generated as part of onboarding.
 *
 * @param data - The validated input conforming to CreatePlayerInput
 * @returns Promise resolving to the new player and invite link
 */
export type CreatePlayerProxy = (
    data: CreatePlayerInput,
) => Promise<{ player: PlayerType; inviteLink: string }>;
