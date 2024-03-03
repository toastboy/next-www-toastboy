import { Outcome } from '@prisma/client';
import outcomeService from 'services/Outcome';
import prisma from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    outcome: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultOutcome: Outcome = {
    gameDayId: 1,
    playerId: 12,
    response: 'Yes',
    responsetime: new Date(),
    points: 3,
    team: 'A',
    comment: 'Test comment',
    pub: 1,
    paid: false,
    goalie: 0,
};

const invalidOutcome: Outcome = {
    ...defaultOutcome,
    playerId: -1,
};

const outcomeList: Outcome[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultOutcome,
    playerId: index % 10 + 1,
    gameDayId: index + 1,
}));

describe('OutcomeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.outcome.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            }
        }) => {
            const outcome = outcomeList.find((outcome) => outcome.gameDayId === args.where.gameDayId_playerId.gameDayId && outcome.playerId === args.where.gameDayId_playerId.playerId);
            return Promise.resolve(outcome ? outcome : null);
        });

        (prisma.outcome.create as jest.Mock).mockImplementation((args: { data: Outcome }) => {
            const outcome = outcomeList.find((outcome) => outcome.gameDayId === args.data.gameDayId && outcome.playerId === args.data.playerId);

            if (outcome) {
                return Promise.reject(new Error('Outcome already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.outcome.upsert as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            },
            update: Outcome,
            create: Outcome,
        }) => {
            const outcome = outcomeList.find((outcome) => outcome.gameDayId === args.where.gameDayId_playerId.gameDayId && outcome.playerId === args.where.gameDayId_playerId.playerId);

            if (outcome) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.outcome.delete as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            }
        }) => {
            const outcome = outcomeList.find((outcome) => outcome.gameDayId === args.where.gameDayId_playerId.gameDayId && outcome.playerId === args.where.gameDayId_playerId.playerId);
            return Promise.resolve(outcome ? outcome : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct Outcome for GameDay 1, Player 1', async () => {
            const result = await outcomeService.get(1, 1);
            expect(result).toEqual({
                ...defaultOutcome,
                gameDayId: 1,
                playerId: 1,
            } as Outcome);
        });

        it('should return null for GameDay 7, Player 16', async () => {
            const result = await outcomeService.get(7, 16);
            expect(result).toBeNull();
        });
    });

    describe('getByGameDay', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockImplementation((args: { where: { gameDayId: number } }) => {
                return Promise.resolve(outcomeList.filter((outcome) => outcome.gameDayId === args.where.gameDayId));
            });
        });

        it('should retrieve the correct Outcomes for GameDay id 1', async () => {
            const result = await outcomeService.getByGameDay(1);
            expect(result.length).toEqual(1);
            for (const outcomeResult of result) {
                expect(outcomeResult).toEqual({
                    ...defaultOutcome,
                    playerId: expect.any(Number),
                    gameDayId: 1,
                } as Outcome);
            }
        });

        it('should return an empty list when retrieving outcomes for GameDay id 101', async () => {
            const result = await outcomeService.getByGameDay(101);
            expect(result).toEqual([]);
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(outcomeList.filter((outcome) => outcome.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct Outcomes for Player ID 1', async () => {
            const result = await outcomeService.getByPlayer(1);
            expect(result.length).toEqual(10);
            for (const outcomeResult of result) {
                expect(outcomeResult).toEqual({
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: expect.any(Number),
                } as Outcome);
            }
        });

        it('should return an empty list when retrieving Outcomes for Player id 11', async () => {
            const result = await outcomeService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(outcomeList);
            });
        });

        it('should return the correct, complete list of 100 Outcomes', async () => {
            const result = await outcomeService.getAll();
            expect(result.length).toEqual(100);
            expect(result[11].playerId).toEqual(2);
            expect(result[41].responsetime).toEqual(expect.any(Date));
        });
    });

    describe('create', () => {
        it('should create an Outcome', async () => {
            const result = await outcomeService.create(defaultOutcome);
            expect(result).toEqual(defaultOutcome);
        });

        it('should refuse to create an Outcome with invalid data', async () => {
            await expect(outcomeService.create(invalidOutcome)).rejects.toThrow();
        });

        it('should refuse to create an Outcome that has the same GameDay ID and Player ID as an existing one', async () => {
            await expect(outcomeService.create({
                ...defaultOutcome,
                playerId: 1,
                gameDayId: 1,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create an outcome where the combination of GameDay ID and Player ID did not exist', async () => {
            const result = await outcomeService.upsert(defaultOutcome);
            expect(result).toEqual(defaultOutcome);
        });

        it('should update an existing Outcome where the combination of GameDay ID and Player ID already existed', async () => {
            const updatedOutcome = {
                ...defaultOutcome,
                playerId: 1,
                gameDayId: 1,
                response: 'No',
                Comment: 'Updated comment',
            };
            const result = await outcomeService.upsert(updatedOutcome);
            expect(result).toEqual(updatedOutcome);
        });

        it('should refuse to create an Outcome with invalid data where the combination of GameDay ID and Player ID did not exist', async () => {
            await expect(outcomeService.create(invalidOutcome)).rejects.toThrow();
        });

        it('should refuse to update an Outcome with invalid data where the combination of GameDay ID and Player ID already existed', async () => {
            await expect(outcomeService.create(invalidOutcome)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing Outcome', async () => {
            await outcomeService.delete(1, 1);
        });

        it('should silently return when asked to delete an Outcome that does not exist', async () => {
            await outcomeService.delete(7, 16);
        });
    });

    describe('deleteAll', () => {
        it('should delete all Outcomes', async () => {
            await outcomeService.deleteAll();
        });
    });
});
