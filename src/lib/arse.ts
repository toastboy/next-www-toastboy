import { isServer } from 'lib/utils';
import { arse } from '@prisma/client';
import prisma from 'lib/prisma';
import axios from 'axios';
import debug from 'debug';

const log = debug('footy:api');

interface ArseInterface {
    get(id: number): Promise<arse | null>;
    getAll(): Promise<arse[] | null>;
    create(data: ArseData): Promise<arse | null>;
    upsert(data: ArseData): Promise<arse | null>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
}

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

/**
 * Take a generic object from a JSON API response and turn it into an arse
 * @param {object} json The arse to parse
 * @returns the parsed arse
 */
function parseJSONArse(json: object) {
    return validateArse({
        ...json,
        stamp: new Date(json["stamp"]),
    } as arse);
}

/**
 * Validate an arse: throws an error if there's something wrong
 * @param {arse} arse The arse to validate
 * @returns the validated arse
 */
function validateArse(arse: arse) {
    // TODO: Add some arse validation steps
    return arse;
}

export class ServerArseService {
    /**
     * Gets a single arse by id
     * @param id The numeric ID for the arse
     * @returns A promise that resolves to the arse or undefined if none was
     * found
     */
    async get(id: number): Promise<arse | null> {
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
    async getAll(): Promise<arse[] | null> {
        return prisma.arse.findMany({});
    }

    /**
     * Creates an arse
     * @param data The properties to add to the arse
     * @returns A promise that resolves to the newly-created arse
     */
    async create(data: ArseData): Promise<arse | null> {
        return await prisma.arse.create({
            data: data
        });
    }

    /**
     * Updates an arse if it exists, or creates it if not
     * @param data The properties to add to the arse
     * @returns A promise that resolves to the updated or created arse
     */
    async upsert(data: ArseData): Promise<arse | null> {
        return await prisma.arse.upsert({
            where: { id: data.id },
            update: data,
            create: data,
        });
    }

    /**
     * Deletes an arse. If no such arse exists, that's not an error.
     * @param id The ID of the arse to delete
     */
    async delete(id: number): Promise<void> {
        await prisma.arse.delete({
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

export class ClientArseService {
    /**
     * Gets a single arse by id
     * @param id The numeric ID for the arse
     * @returns A promise that resolves to the arse or undefined if none was
     * found
     */
    async get(id: number): Promise<arse | null> {
        try {
            const response = await axios.get(`/api/footy/arse/${id}`);
            return parseJSONArse(response.data["arse"]);
        } catch (error) {
            log('Error fetching arse:', error);
            return null;
        }
    }

    /**
     * Gets all arses at once
     * @returns A promise that resolves to all arses
     */
    async getAll(): Promise<arse[] | null> {
        try {
            const response = await axios.get<arse[]>(`/api/footy/arses`);
            response.data.forEach(arse => {
                validateArse(arse);
            });
            return response.data;
        } catch (error) {
            log('Error fetching all arses:', error);
            return null;
        }
    }

    /**
     * Creates an arse
     * @param data The properties to add to the arse
     * @returns A promise that resolves to the newly-created arse
     */
    async create(data: ArseData): Promise<arse | null> {
        try {
            const response = await axios.post<arse>(`/api/footy/arses`, data);
            return validateArse(response.data);
        } catch (error) {
            log('Error creating arse:', error);
            throw error;
        }
    }

    /**
     * Updates an arse if it exists, or creates it if not
     * @param data The properties to add to the arse
     * @returns A promise that resolves to the updated or created arse
     */
    async upsert(data: ArseData): Promise<arse | null> {
        try {
            const response = await axios.put<arse>(`/api/footy/arses`, data);
            return validateArse(response.data);
        } catch (error) {
            log('Error upserting arse:', error);
            throw error;
        }
    }

    /**
     * Deletes an arse. If no such arse exists, that's not an error.
     * @param id The ID of the arse to delete
     */
    async delete(id: number): Promise<void> {
        try {
            const response = await axios.delete<arse>(`/api/footy/arse/${id}`);
            validateArse(response.data);
        } catch (error) {
            log('Error deleting arse:', error);
        }
    }

    /**
     * Deletes all arses
     */
    async deleteAll(): Promise<void> {
        try {
            await axios.delete<arse>(`/api/footy/arses`);
        } catch (error) {
            log('Error deleting arses:', error);
        }
    }
}

const arseService: ArseInterface = isServer ? new ServerArseService() : new ClientArseService();

export default arseService;
