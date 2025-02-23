import { CountrySupporter } from '@prisma/client';
import debug from 'debug';
import prisma from 'lib/prisma';
import { CountrySupporterWithCountry } from 'lib/types';

const log = debug('footy:api');

export class CountrySupporterService {
    /**
     * Validate a CountrySupporter
     * @param countrySupporter The CountrySupporter to validate
     * @returns the validated CountrySupporter
     * @throws An error if the CountrySupporter is invalid.
     */
    validate(countrySupporter: CountrySupporter): CountrySupporter {
        if (!countrySupporter.playerId || !Number.isInteger(countrySupporter.playerId) || countrySupporter.playerId < 0) {
            throw new Error(`Invalid playerId value: ${countrySupporter.playerId}`);
        }
        if (!countrySupporter.countryISOCode || (!/^[A-Z]{2}$/.test(countrySupporter.countryISOCode) && !/^[A-Z]{2}-[A-Z]{3}$/.test(countrySupporter.countryISOCode))) {
            throw new Error(`Invalid countryISOCode value: ${countrySupporter.countryISOCode}`);
        }

        return countrySupporter;
    }

    /**
     * Retrieves a CountrySupporter for the given player ID and country ISO code.
     * @param playerId - The ID of the player.
     * @param countryISOCode - The ISO code of the country.
     * @returns A promise that resolves to the CountrySupporter if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, countryISOCode: string): Promise<CountrySupporter | null> {
        try {
            return prisma.countrySupporter.findUnique({
                where: {
                    playerId_countryISOCode: {
                        playerId: playerId,
                        countryISOCode: countryISOCode,
                    },
                },
            });
        } catch (error) {
            log(`Error fetching CountrySupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all CountrySupporters.
     * @returns A promise that resolves to an array of CountrySupporters or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<CountrySupporter[] | null> {
        try {
            return prisma.countrySupporter.findMany({});
        } catch (error) {
            log(`Error fetching CountrySupporters: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves CountrySupporters by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of CountrySupporterWithCountry objects or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<CountrySupporterWithCountry[] | null> {
        try {
            return prisma.countrySupporter.findMany({
                where: {
                    playerId: playerId,
                },
                include: {
                    country: true,
                },
            });
        } catch (error) {
            log(`Error fetching CountrySupporters by player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves CountrySupporters by country ISO code.
     * @param countryISOCode - The ISO code of the country.
     * @returns A promise that resolves to an array of CountrySupporter or null.
     * @throws An error if there is a failure.
     */
    async getByCountry(countryISOCode: string): Promise<CountrySupporter[] | null> {
        try {
            return prisma.countrySupporter.findMany({
                where: {
                    countryISOCode: countryISOCode,
                },
            });
        } catch (error) {
            log(`Error fetching CountrySupporters by ISO code: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new CountrySupporter.
     * @param data The data for the new CountrySupporter.
     * @returns A promise that resolves to the created CountrySupporter, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: CountrySupporter): Promise<CountrySupporter | null> {
        try {
            return await prisma.countrySupporter.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating CountrySupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a CountrySupporter.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted CountrySupporter, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: CountrySupporter): Promise<CountrySupporter | null> {
        try {
            return await prisma.countrySupporter.upsert({
                where: {
                    playerId_countryISOCode: {
                        playerId: data.playerId,
                        countryISOCode: data.countryISOCode,
                    },
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting CountrySupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a CountrySupporter.
     * @param playerId - The ID of the player.
     * @param countryISOCode - The ISO code of the country.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(playerId: number, countryISOCode: string): Promise<void> {
        try {
            await prisma.countrySupporter.delete({
                where: {
                    playerId_countryISOCode: {
                        playerId: playerId,
                        countryISOCode: countryISOCode,
                    },
                },
            });
        } catch (error) {
            log(`Error deleting CountrySupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all CountrySupporters.
     * @returns A promise that resolves when all CountrySupporters are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.countrySupporter.deleteMany();
        } catch (error) {
            log(`Error deleting CountrySupporter: ${error}`);
            throw error;
        }
    }
}

const countrySupporterService = new CountrySupporterService();
export default countrySupporterService;
