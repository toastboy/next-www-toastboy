import HomePage from './home'
import * as players from 'lib/players'

export default async function Page() {
    const allPlayers = await players.getAll()
    return <HomePage players={allPlayers} />
}
