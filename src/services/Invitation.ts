import { Invitation } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class InvitationService {
    /**
     * Validate a Invitation
     * @param invitation The Invitation to validate
     * @returns the validated Invitation
     * @throws An error if the Invitation is invalid.
     */
    validate(invitation: Invitation): Invitation {
        if (!invitation.uuid || typeof invitation.uuid !== 'string' || invitation.uuid === '') {
            throw new Error(`Invalid uuid value: ${invitation.uuid}`);
        }
        if (!invitation.player || !Number.isInteger(invitation.player) || invitation.player < 0) {
            throw new Error(`Invalid player value: ${invitation.player}`);
        }
        if (!invitation.game_day || !Number.isInteger(invitation.game_day) || invitation.game_day < 0) {
            throw new Error(`Invalid game_day value: ${invitation.game_day}`);
        }

        return invitation;
    }

    /**
     * Retrieves a Invitation by its ID.
     * @param uuid - The ID of the Invitation to retrieve.
     * @returns A Promise that resolves to the Invitation object if found, or null if not found.
     * @throws If there is an error while fetching the Invitation.
     */
    async get(uuid: string): Promise<Invitation | null> {
        try {
            return prisma.invitation.findUnique({
                where: {
                    uuid: uuid
                },
            });
        } catch (error) {
            log(`Error fetching Invitation: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all Invitation.
     * @returns A promise that resolves to an array of Invitations or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<Invitation[] | null> {
        try {
            return prisma.invitation.findMany({});
        } catch (error) {
            log(`Error fetching Invitation: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new invitation.
     * @param data The data for the new invitation.
     * @returns A promise that resolves to the created invitation, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: Invitation): Promise<Invitation | null> {
        try {
            return await prisma.invitation.create({
                data: this.validate(data)
            });
        } catch (error) {
            log(`Error creating Invitation: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a invitation.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted invitation, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: Invitation): Promise<Invitation | null> {
        try {
            return await prisma.invitation.upsert({
                where: {
                    uuid: data.uuid
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting Invitation: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a invitation by its ID.
     * @param uuid - The ID of the invitation to delete.
     * @throws If there is an error deleting the invitation.
     */
    async delete(uuid: string): Promise<void> {
        try {
            await prisma.invitation.delete({
                where: {
                    uuid: uuid
                },
            });
        } catch (error) {
            log(`Error deleting Invitation: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all invitations.
     * @returns A promise that resolves when all invitations are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.invitation.deleteMany();
        } catch (error) {
            log(`Error deleting Invitations: ${error}`);
            throw error;
        }
    }
}

const invitationService = new InvitationService();
export default invitationService;
