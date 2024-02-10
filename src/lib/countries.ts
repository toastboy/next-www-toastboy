import { country } from '@prisma/client';
import prisma from 'lib/prisma';

/**
 * Get all countries
 *
 * @returns Array of prisma.country objects
 */

export async function getAll(): Promise<country[]> {
    return await prisma.country.findMany({});
}

/**
 * Return a list of all country ids
 *
 * @returns A map containing all ids
 */

export async function getAllIds() {
    const data = await prisma.country.findMany({});

    return data.map((country: country) => ({
        iso_code: country.iso_code,
    }));
}

/**
 * Return a country identified by their id
 *
 * @param id The country id
 *
 * @returns A country model object or null if there is no such country
 */

export async function getById(iso_code: string): Promise<country | null> {
    const data = await prisma.country.findMany({
        where: {
            iso_code: {
                equals: iso_code,
            },
        },
    });

    return data[0] as country;
}
