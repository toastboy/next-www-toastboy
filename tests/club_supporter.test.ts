import { ClubSupporter } from '@prisma/client';
import ClubSupporterService from 'services/ClubSupporter';
import prisma from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    ClubSupporter: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultClubSupporter: ClubSupporter = {
    playerId: 12,
    clubId: 2270
};

const invalidClubSupporter: ClubSupporter = {
    ...defaultClubSupporter,
    playerId: -1,
};

const clubSupporterList: ClubSupporter[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultClubSupporter,
    playerId: index % 10 + 1,
    clubId: index + 1,
}));

describe('ClubSupporterService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.clubSupporter.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                playerId_clubId: {
                    playerId: number,
                    clubId: number
                }
            }
        }) => {
            const ClubSupporter = clubSupporterList.find((ClubSupporter) => ClubSupporter.playerId === args.where.playerId_clubId.playerId && ClubSupporter.clubId === args.where.playerId_clubId.clubId);
            return Promise.resolve(ClubSupporter ? ClubSupporter : null);
        });

        (prisma.clubSupporter.create as jest.Mock).mockImplementation((args: { data: ClubSupporter }) => {
            const ClubSupporter = clubSupporterList.find((ClubSupporter) => ClubSupporter.playerId === args.data.playerId && ClubSupporter.clubId === args.data.clubId);

            if (ClubSupporter) {
                return Promise.reject(new Error('ClubSupporter already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.clubSupporter.upsert as jest.Mock).mockImplementation((args: {
            where: {
                playerId_clubId: {
                    playerId: number,
                    clubId: number
                }
            },
            update: ClubSupporter,
            create: ClubSupporter,
        }) => {
            const ClubSupporter = clubSupporterList.find((ClubSupporter) => ClubSupporter.playerId === args.where.playerId_clubId.playerId && ClubSupporter.clubId === args.where.playerId_clubId.clubId);

            if (ClubSupporter) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.clubSupporter.delete as jest.Mock).mockImplementation((args: {
            where: {
                playerId_clubId: {
                    playerId: number,
                    clubId: number
                }
            }
        }) => {
            const ClubSupporter = clubSupporterList.find((ClubSupporter) => ClubSupporter.playerId === args.where.playerId_clubId.playerId && ClubSupporter.clubId === args.where.playerId_clubId.clubId);
            return Promise.resolve(ClubSupporter ? ClubSupporter : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct ClubSupporter for player 6, rater 16', async () => {
            const result = await ClubSupporterService.get(6, 16);
            expect(result).toEqual({
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16
            } as ClubSupporter);
        });

        it('should return null for player 7, rater 16', async () => {
            const result = await ClubSupporterService.get(7, 16);
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.clubSupporter.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(clubSupporterList.filter((ClubSupporter) => ClubSupporter.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct ClubSupporters for player id 1', async () => {
            const result = await ClubSupporterService.getByPlayer(1);
            expect(result.length).toEqual(10);
            for (const ClubSupporterResult of result) {
                expect(ClubSupporterResult).toEqual({
                    ...defaultClubSupporter,
                    playerId: 1,
                    clubId: expect.any(Number)
                } as ClubSupporter);
            }
        });

        it('should return an empty list when retrieving ClubSupporters for player id 11', async () => {
            const result = await ClubSupporterService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getByClub', () => {
        beforeEach(() => {
            (prisma.clubSupporter.findMany as jest.Mock).mockImplementation((args: { where: { clubId: number } }) => {
                return Promise.resolve(clubSupporterList.filter((ClubSupporter) => ClubSupporter.clubId === args.where.clubId));
            });
        });

        it('should retrieve the correct ClubSupporters for rater id 1', async () => {
            const result = await ClubSupporterService.getByClub(1);
            expect(result.length).toEqual(1);
            for (const ClubSupporterResult of result) {
                expect(ClubSupporterResult).toEqual({
                    ...defaultClubSupporter,
                    playerId: expect.any(Number),
                    clubId: 1
                } as ClubSupporter);
            }
        });

        it('should return an empty list when retrieving ClubSupporters for rater id 101', async () => {
            const result = await ClubSupporterService.getByClub(101);
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.clubSupporter.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(clubSupporterList);
            });
        });

        it('should return the correct, complete list of 100 ClubSupporters', async () => {
            const result = await ClubSupporterService.getAll();
            expect(result.length).toEqual(100);
            expect(result[11].playerId).toEqual(2);
            expect(result[11].clubId).toEqual(12);
        });
    });

    describe('create', () => {
        it('should create a ClubSupporter', async () => {
            const result = await ClubSupporterService.create(defaultClubSupporter);
            expect(result).toEqual(defaultClubSupporter);
        });

        it('should refuse to create a ClubSupporter with invalid data', async () => {
            await expect(ClubSupporterService.create(invalidClubSupporter)).rejects.toThrow();
        });

        it('should refuse to create a ClubSupporter that has the same player ID and rater ID as an existing one', async () => {
            await expect(ClubSupporterService.create({
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a ClubSupporter where the combination of player ID and rater ID did not exist', async () => {
            const result = await ClubSupporterService.upsert(defaultClubSupporter);
            expect(result).toEqual(defaultClubSupporter);
        });

        it('should update an existing ClubSupporter where the combination of player ID and rater ID already existed', async () => {
            const updatedClubSupporter = {
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16,
                in_goal: 7,
            };
            const result = await ClubSupporterService.upsert(updatedClubSupporter);
            expect(result).toEqual(updatedClubSupporter);
        });

        it('should refuse to create a ClubSupporter with invalid data where the combination of player ID and rater ID did not exist', async () => {
            await expect(ClubSupporterService.create(invalidClubSupporter)).rejects.toThrow();
        });

        it('should refuse to update a ClubSupporter with invalid data where the combination of player ID and rater ID already existed', async () => {
            await expect(ClubSupporterService.create(invalidClubSupporter)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing ClubSupporter', async () => {
            await ClubSupporterService.delete(6, 16);
        });

        it('should silently return when asked to delete a ClubSupporter that does not exist', async () => {
            await ClubSupporterService.delete(7, 16);
        });
    });

    describe('deleteAll', () => {
        it('should delete all ClubSupporters', async () => {
            await ClubSupporterService.deleteAll();
        });
    });
});
