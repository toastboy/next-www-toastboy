import HomePage from './home'
import prisma from '../lib/prisma'

async function getPlayers() {
    const data = await prisma.player.findMany({
        where: {
            finished: {
                equals: null,
            },
        },
    })

    return data
}

export default async function Page() {
    const players = await getPlayers()
    return <HomePage players={players} />
}
