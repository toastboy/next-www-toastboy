// Lightweight mock for GameDay service so Storybook can render components without Prisma/server-only.
type MockGameDay = { id: number; date: string };

const mockGameDays: Record<number, MockGameDay> = {
  1: { id: 1, date: '2024-10-01T18:30:00.000Z' },
  2: { id: 2, date: '2024-10-08T18:30:00.000Z' },
};

const gameDayService = {
  async get(id: number): Promise<MockGameDay | null> {
    return mockGameDays[id] ?? { id, date: new Date().toISOString() };
  },
};

export default gameDayService;
