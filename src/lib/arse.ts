import { arse } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class ArseService {
    /**
     * Validate an arse: throws an error if there's something wrong
     * @param {arse} arse The arse to validate
     * @returns the validated arse
     */
    validate(arse: arse): arse {
        const now = new Date();

        if (!arse.stamp || isNaN(arse.stamp.getTime()) || arse.stamp > now) {
            throw new Error(`Invalid stamp value: ${arse.stamp}`);
        }

        if (!arse.playerId || !Number.isInteger(arse.playerId)) {
            throw new Error(`Invalid player value: ${arse.playerId}`);
        }
        if (!arse.raterId || !Number.isInteger(arse.raterId)) {
            throw new Error(`Invalid rater value: ${arse.raterId}`);
        }

        if (!arse.in_goal || !Number.isInteger(arse.in_goal) || arse.in_goal < 0 || arse.in_goal > 10) {
            throw new Error(`Invalid in_goal value: ${arse.in_goal}`);
        }
        if (!arse.running || !Number.isInteger(arse.running) || arse.running < 0 || arse.running > 10) {
            throw new Error(`Invalid running value: ${arse.running}`);
        }
        if (!arse.shooting || !Number.isInteger(arse.shooting) || arse.shooting < 0 || arse.shooting > 10) {
            throw new Error(`Invalid shooting value: ${arse.shooting}`);
        }
        if (!arse.passing || !Number.isInteger(arse.passing) || arse.passing < 0 || arse.passing > 10) {
            throw new Error(`Invalid passing value: ${arse.passing}`);
        }
        if (!arse.ball_skill || !Number.isInteger(arse.ball_skill) || arse.ball_skill < 0 || arse.ball_skill > 10) {
            throw new Error(`Invalid ball_skill value: ${arse.ball_skill}`);
        }
        if (!arse.attacking || !Number.isInteger(arse.attacking) || arse.attacking < 0 || arse.attacking > 10) {
            throw new Error(`Invalid attacking value: ${arse.attacking}`);
        }
        if (!arse.defending || !Number.isInteger(arse.defending) || arse.defending < 0 || arse.defending > 10) {
            throw new Error(`Invalid defending value: ${arse.defending}`);
        }

        return arse;
    }

    /**
     * Gets all arses at once
     * @returns A promise that resolves to all arses
     */
    async getAll(): Promise<arse[] | null> {
        try {
            return prisma.arse.findMany({});
        } catch (error) {
            log(`Error fetching arses: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves arses by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of arses or null.
     */
    async getByPlayer(playerId: number): Promise<arse[] | null> {
        try {
            return prisma.arse.findMany({
                where: {
                    playerId: playerId
                },
            });
        } catch (error) {
            log(`Error fetching arses by player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves arses by rater ID.
     * @param playerId - The ID of the rater.
     * @returns A promise that resolves to an array of arses or null.
     */
    async getByRater(raterId: number): Promise<arse[] | null> {
        try {
            return prisma.arse.findMany({
                where: {
                    raterId: raterId
                },
            });
        } catch (error) {
            log(`Error fetching arses by rater: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new arse.
     * @param data The data for the arse.
     * @returns A promise that resolves to the created arse, or null if an error occurs.
     */
    async create(data: arse): Promise<arse | null> {
        try {
            return await prisma.arse.create({
                data: this.validate(data)
            });
        } catch (error) {
            log(`Error creating arse: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts an arse.
     *
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted arse, or null if the upsert failed.
     * @throws An error if the upsert operation encounters an error.
     */
    async upsert(data: arse): Promise<arse | null> {
        try {
            return await prisma.arse.upsert({
                where: {
                    playerId_raterId: {
                        playerId: data.playerId,
                        raterId: data.raterId
                    }
                },
                update: data,
                create: data,
            });
        } catch (error) {
            log(`Error upserting arse: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes an arse.
     *
     * @param playerId - The ID of the player.
     * @param raterId - The ID of the rater.
     * @returns A Promise that resolves to void.
     * @throws If there is an error deleting the arse record.
     */
    async delete(playerId: number, raterId: number): Promise<void> {
        try {
            await prisma.arse.delete({
                where: {
                    playerId_raterId: {
                        playerId: playerId,
                        raterId: raterId
                    }
                },
            });
        } catch (error) {
            log(`Error deleting arse: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all arses.
     * @returns A promise that resolves when all arses are deleted.
     * @throws If there is an error deleting the arses.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.arse.deleteMany();
        } catch (error) {
            log(`Error deleting arses: ${error}`);
            throw error;
        }
    }
}

const arseService = new ArseService();
export default arseService;
