import { club } from '@prisma/client'
import prisma from 'lib/prisma'

/**
 * Get all clubs
 *
 * @returns Array of prisma.club objects
 */

export async function getAll(): Promise<club[]> {
    return await prisma.club.findMany({})
}

/**
 * Return a list of all club ids
 *
 * @returns A map containing all ids
 */

export async function getAllIds() {
    const data = await prisma.club.findMany({})

    return data.map((club: club) => ({
        id: club.id.toString(),
    }))
}

/**
 * Return a club identified by their id
 *
 * @param id The club id
 *
 * @returns A club model object or null if there is no such club
 */

export async function getById(id: number): Promise<club | null> {
    if (id == null || isNaN(id)) {
        return null
    }

    const data = await prisma.club.findMany({
        where: {
            id: {
                equals: id,
            },
        },
    })

    return data[0] as club
}
