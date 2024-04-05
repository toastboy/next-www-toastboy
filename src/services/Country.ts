import { Country } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class CountryService {
    /**
     * Validate a country
     * @param country The country to validate
     * @returns the validated country
     * @throws An error if the country is invalid.
     */
    validate(country: Country): Country {
        if (!country.isoCode || (!/^[A-Z]{2}$/.test(country.isoCode) && !/^[A-Z]{2}-[A-Z]{3}$/.test(country.isoCode))) {
            throw new Error(`Invalid isoCode value: ${country.isoCode}`);
        }

        return country;
    }

    /**
     * Retrieves a country by its ID.
     * @param id - The ID of the country to retrieve.
     * @returns A Promise that resolves to the country object if found, or null if not found.
     * @throws If there is an error while fetching the country.
     */
    async get(isoCode: string): Promise<Country | null> {
        try {
            return prisma.country.findUnique({
                where: {
                    isoCode: isoCode,
                },
            });
        } catch (error) {
            log(`Error fetching country: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all countries.
     * @returns A promise that resolves to an array of countries or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<Country[] | null> {
        try {
            return prisma.country.findMany({});
        } catch (error) {
            log(`Error fetching countries: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new country.
     * @param data The data for the new country.
     * @returns A promise that resolves to the created country, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: Country): Promise<Country | null> {
        try {
            return await prisma.country.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating country: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a country.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted country, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: Country): Promise<Country | null> {
        try {
            return await prisma.country.upsert({
                where: {
                    isoCode: data.isoCode,
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting country: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a country by its ID.
     * @param id - The ID of the country to delete.
     * @throws If there is an error deleting the country.
     */
    async delete(isoCode: string): Promise<void> {
        try {
            await prisma.country.delete({
                where: {
                    isoCode: isoCode,
                },
            });
        } catch (error) {
            log(`Error deleting country: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all countries.
     * @returns A promise that resolves when all countries are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.country.deleteMany();
        } catch (error) {
            log(`Error deleting countries: ${error}`);
            throw error;
        }
    }
}

const countryService = new CountryService();
export default countryService;
