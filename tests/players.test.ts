import { getAll } from 'lib/players'

test('list of all players should be more than 195 ', async () => {
    const players = await getAll(false)

    expect(players).toBeDefined()
    expect(players.length).toBeGreaterThan(195)
})

test('list of active players should be more than 0 ', async () => {
    const players = await getAll(true)

    expect(players).toBeDefined()
    expect(players.length).toBeGreaterThan(0)
})
