import { getAll } from 'lib/players'

test('list of all players should be more than 200 ', async () => {
    const players = await getAll(false)

    expect(players).toBeDefined()
    expect(players.length).toBeGreaterThan(200)
})

test('list of active players should be more than 0 ', async () => {
    const players = await getAll(true)

    expect(players).toBeDefined()
    expect(players.length).toBeGreaterThan(0)
})
