import { notFound } from 'next/navigation'

import * as players from 'lib/players'

export async function generateStaticParams() {
    return players.getAllIdsAndLogins()
}

export default async function Page({
    params,
}: {
    params: { idOrLogin: string },
})
    : Promise<JSX.Element> {
    const player = await players.getById(Number(params.idOrLogin)) || await players.getByLogin(params.idOrLogin)

    if (!player) {
        return notFound()
    }

    return <div>{player.email || "(No email)"}</div>
}
