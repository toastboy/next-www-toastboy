import prisma from '@/lib/prisma'
import { player } from '@prisma/client'

export async function generateStaticParams() {
    const data = await prisma.player.findMany({})

    return data.map((player: player) => ({
        login: player.login,
    }))
}

export default function Page({
    params,
}: {
    params: { login: string },
}) {
    return <h1>{params.login}</h1>
}
