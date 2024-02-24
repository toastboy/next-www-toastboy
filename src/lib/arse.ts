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

        if (!arse.id || !Number.isInteger(arse.id) || arse.id < 0) {
            throw new Error(`Invalid id value: ${arse.id}`);
        }
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
     * Gets a single arse by id
     * @param id The numeric ID for the arse
     * @returns A promise that resolves to the arse or undefined if none was
     * found
     */
    async get(id: number): Promise<arse | null> {
        try {
            return prisma.arse.findUnique({
                where: {
                    id: id
                },
            });
        } catch (error) {
            log(`Error fetching arse: ${error}`);
            throw error;
        }
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
     * Creates an arse
     * @param data The properties to add to the arse
     * @returns A promise that resolves to the newly-created arse
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
     * Updates an arse if it exists, or creates it if not
     * @param data The properties to add to the arse
     * @returns A promise that resolves to the updated or created arse
     */
    async upsert(data: arse): Promise<arse | null> {
        try {
            return await prisma.arse.upsert({
                where: { id: data.id },
                update: data,
                create: data,
            });
        } catch (error) {
            log(`Error upserting arse: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes an arse. If no such arse exists, that's not an error.
     * @param id The ID of the arse to delete
     */
    async delete(id: number): Promise<void> {
        try {
            await prisma.arse.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log(`Error deleting arse: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all arses
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
