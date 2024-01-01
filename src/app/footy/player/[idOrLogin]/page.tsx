import prisma from '@/lib/prisma'
import { player } from '@prisma/client'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    const data = await prisma.player.findMany({})

    const ids = data.map((player: player) => ({
        idOrLogin: player.id.toString(),
    }))
    const logins = data.map((player: player) => ({
        idOrLogin: player.login,
    }))

    return new Map([...Array.from(ids.entries()), ...Array.from(logins.entries())]);
}

async function getPlayerByLogin(login: string) {
    const data = await prisma.player.findMany({
        where: {
            login: {
                equals: login,
            },
        },
    })

    return data[0] as player
}

async function getPlayerById(id: number) {
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

export default async function Page({
    params,
}: {
    params: { idOrLogin: string },
}) {
    const player = await getPlayerById(Number(params.idOrLogin)) || await getPlayerByLogin(params.idOrLogin)

    if (!player) {
        return notFound()
    }

    return <div>{player.email || "(No email)"}</div>
}
