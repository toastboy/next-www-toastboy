import { arse } from '@prisma/client';
import prisma from 'lib/prisma';

type ArseData = {
    id?: number;
    stamp?: Date;
    player: number;
    rater: number;
    in_goal: number;
    running: number;
    shooting: number;
    passing: number;
    ball_skill: number;
    attacking: number;
    defending: number;
};

class ArseService {
    /**
     * Gets a single arse by id
     * @param id The numeric ID for the arse
     * @returns A promise that resolves to the arse or undefined if none was
     * found
     */
    async get(id: number): Promise<arse | undefined> {
        return prisma.arse.findUnique({
            where: {
                id: id
            },
        });
    }

    /**
     * Gets all arses at once
     * @returns A promise that resolves to all arses
     */
    async getAll(): Promise<arse[]> {
        return prisma.arse.findMany({});
    }

    /**
     * Creates an arse
     * @param data The properties to add to the arse
     * @returns A promise that resolves to the newly-created arse
     */
    async create(data: ArseData): Promise<arse> {
        return await prisma.arse.create({
            data: data
        });
    }

    /**
     * Updates an arse if it exists, or creates it if not
     * @param data The properties to add to the arse
     * @returns A promise that resolves to the updated or created arse
     */
    async upsert(data: ArseData): Promise<arse> {
        return await prisma.arse.upsert({
            where: { id: data.id },
            update: data,
            create: data,
        });
    }

    /**
     * Deletes an arse. If no such arse exists, that's not an error.
     * @param id The ID of the arse to delete
     * @returns A promise that resolves to the deleted arse if there was one, or
     * undefined otherwise
     */
    async delete(id: number): Promise<arse | undefined> {
        return await prisma.arse.delete({
            where: {
                id: id,
            },
        });
    }

    /**
     * Deletes all arses
     */
    async deleteAll(): Promise<void> {
        await prisma.arse.deleteMany();
    }
}

export const arseService = new ArseService();
