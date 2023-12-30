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

    // Make sure things are serialisable as JSON
    const players = data.map((player) => ({
        ...player,
        born: player.born == null ? "" : player.born.toLocaleDateString('sv'),
        finished: player.finished == null ? "" : player.finished.toLocaleDateString('sv'),
        joined: player.joined == null ? "" : player.joined.toLocaleDateString('sv'),
    }))
    return players
}

export default async function Page() {
    const players = await getPlayers()
    return <HomePage players={players} />
}
