import { player } from '@prisma/client'
import prisma from 'lib/prisma'

/**
 * Get all players matching the given criteria
 *
 * @param active Only return active players
 *
 * @returns Array of prisma.player objects
 */

export async function getAll(active = true): Promise<player[]> {
    if (active) {
        return await prisma.player.findMany({
            where: {
                finished: {
                    equals: null,
                },
            },
        })
    }
    else {
        return await prisma.player.findMany({})
    }
}

/**
 * Return a list of all player ids and logins, so that either can be used to
 * refer to a given player
 *
 * @returns A map containing all logins and ids
 */

export async function getAllIdsAndLogins() {
    const data = await prisma.player.findMany({})

    const ids = data.map((player: player) => ({
        idOrLogin: player.id.toString(),
    }))
    const logins = data.map((player: player) => ({
        idOrLogin: player.login,
    }))

    return new Map([...Array.from(ids.entries()), ...Array.from(logins.entries())]);
}

export async function getByLogin(login: string): Promise<player | null> {
    const data = await prisma.player.findMany({
        where: {
            login: {
                equals: login,
            },
        },
    })

    return data[0] as player
}

export async function getById(id: number): Promise<player | null> {
    if (id == null || isNaN(id)) {
        return null
    }

    const data = await prisma.player.findMany({
        where: {
            id: {
                equals: id,
            },
        },
    })

    return data[0] as player
}

