import debug from 'debug';
import prisma from 'lib/prisma';
import { Arse } from 'prisma/generated/prisma/client';

const log = debug('footy:api');

export class ArseService {
    /**
     * Validate an arse
     * @param arse The arse to validate
     * @returns the validated arse
     * @throws An error if the arse is invalid.
     */
    validate(arse: Arse): Arse {
        const now = new Date();

        if (!arse.stamp || isNaN(arse.stamp.getTime()) || arse.stamp > now) {
            throw new Error(`Invalid stamp value: ${arse.stamp}`);
        }

        if (!arse.playerId || !Number.isInteger(arse.playerId) || arse.playerId < 0) {
            throw new Error(`Invalid player value: ${arse.playerId}`);
        }
        if (!arse.raterId || !Number.isInteger(arse.raterId) || arse.raterId < 0) {
            throw new Error(`Invalid rater value: ${arse.raterId}`);
        }

        if (!arse.inGoal || !Number.isInteger(arse.inGoal) || arse.inGoal < 0 || arse.inGoal > 10) {
            throw new Error(`Invalid inGoal value: ${arse.inGoal}`);
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
        if (!arse.ballSkill || !Number.isInteger(arse.ballSkill) || arse.ballSkill < 0 || arse.ballSkill > 10) {
            throw new Error(`Invalid ballSkill value: ${arse.ballSkill}`);
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
     * Retrieves an arse for the given player ID rated by rater ID.
     * @param playerId - The ID of the player.
     * @param raterId - The ID of the rater.
     * @returns A promise that resolves to the "arse" object if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, raterId: number): Promise<Arse | null> {
        try {
            return prisma.arse.findUnique({
                where: {
                    playerId_raterId: {
                        playerId: playerId,
                        raterId: raterId,
                    },
                },
            });
        } catch (error) {
            log(`Error fetching arses: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all arses.
     * @returns A promise that resolves to an array of arses or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<Arse[] | null> {
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
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<Partial<Arse> | null> {
        try {
            const arsegregate = await prisma.arse.aggregate({
                where: {
                    playerId: playerId,
                },
                _avg: {
                    inGoal: true,
                    running: true,
                    shooting: true,
                    passing: true,
                    ballSkill: true,
                    attacking: true,
                    defending: true,
                },
            });

            return arsegregate._avg;
        } catch (error) {
            log(`Error fetching arses by player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves arses by rater ID.
     * @param raterId - The ID of the rater.
     * @returns A promise that resolves to an array of arses or null.
     * @throws An error if there is a failure.
     */
    async getByRater(raterId: number): Promise<Arse[] | null> {
        try {
            return prisma.arse.findMany({
                where: {
                    raterId: raterId,
                },
            });
        } catch (error) {
            log(`Error fetching arses by rater: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new arse.
     * @param data The data for the new arse.
     * @returns A promise that resolves to the created arse, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: Arse): Promise<Arse | null> {
        try {
            return await prisma.arse.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating arse: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts an arse.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted arse, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: Arse): Promise<Arse | null> {
        try {
            return await prisma.arse.upsert({
                where: {
                    playerId_raterId: {
                        playerId: data.playerId,
                        raterId: data.raterId,
                    },
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting arse: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes an arse.
     * @param playerId - The ID of the player.
     * @param raterId - The ID of the rater.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(playerId: number, raterId: number): Promise<void> {
        try {
            await prisma.arse.delete({
                where: {
                    playerId_raterId: {
                        playerId: playerId,
                        raterId: raterId,
                    },
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
     * @throws An error if there is a failure.
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
