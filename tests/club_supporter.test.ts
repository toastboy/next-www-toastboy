import { club_supporter } from '@prisma/client';
import ClubSupporterService from 'services/club_supporter';
import prisma from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    club_supporter: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultClubSupporter: club_supporter = {
    playerId: 12,
    clubId: 2270
};

const invalidclub_supporter: club_supporter = {
    ...defaultClubSupporter,
    playerId: -1,
};

const clubSupporterList: club_supporter[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultClubSupporter,
    playerId: index % 10 + 1,
    clubId: index + 1,
}));

describe('ClubSupporterService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.club_supporter.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                playerId_clubId: {
                    playerId: number,
                    clubId: number
                }
            }
        }) => {
            const club_supporter = clubSupporterList.find((club_supporter) => club_supporter.playerId === args.where.playerId_clubId.playerId && club_supporter.clubId === args.where.playerId_clubId.clubId);
            return Promise.resolve(club_supporter ? club_supporter : null);
        });

        (prisma.club_supporter.create as jest.Mock).mockImplementation((args: { data: club_supporter }) => {
            const club_supporter = clubSupporterList.find((club_supporter) => club_supporter.playerId === args.data.playerId && club_supporter.clubId === args.data.clubId);

            if (club_supporter) {
                return Promise.reject(new Error('club_supporter already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.club_supporter.upsert as jest.Mock).mockImplementation((args: {
            where: {
                playerId_clubId: {
                    playerId: number,
                    clubId: number
                }
            },
            update: club_supporter,
            create: club_supporter,
        }) => {
            const club_supporter = clubSupporterList.find((club_supporter) => club_supporter.playerId === args.where.playerId_clubId.playerId && club_supporter.clubId === args.where.playerId_clubId.clubId);

            if (club_supporter) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.club_supporter.delete as jest.Mock).mockImplementation((args: {
            where: {
                playerId_clubId: {
                    playerId: number,
                    clubId: number
                }
            }
        }) => {
            const club_supporter = clubSupporterList.find((club_supporter) => club_supporter.playerId === args.where.playerId_clubId.playerId && club_supporter.clubId === args.where.playerId_clubId.clubId);
            return Promise.resolve(club_supporter ? club_supporter : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct club_supporter for player 6, rater 16', async () => {
            const result = await ClubSupporterService.get(6, 16);
            expect(result).toEqual({
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16
            } as club_supporter);
        });

        it('should return null for player 7, rater 16', async () => {
            const result = await ClubSupporterService.get(7, 16);
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.club_supporter.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(clubSupporterList.filter((club_supporter) => club_supporter.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct club_supporters for player id 1', async () => {
            const result = await ClubSupporterService.getByPlayer(1);
            expect(result.length).toEqual(10);
            for (const club_supporterResult of result) {
                expect(club_supporterResult).toEqual({
                    ...defaultClubSupporter,
                    playerId: 1,
                    clubId: expect.any(Number)
                } as club_supporter);
            }
        });

        it('should return an empty list when retrieving club_supporters for player id 11', async () => {
            const result = await ClubSupporterService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getByClub', () => {
        beforeEach(() => {
            (prisma.club_supporter.findMany as jest.Mock).mockImplementation((args: { where: { clubId: number } }) => {
                return Promise.resolve(clubSupporterList.filter((club_supporter) => club_supporter.clubId === args.where.clubId));
            });
        });

        it('should retrieve the correct club_supporters for rater id 1', async () => {
            const result = await ClubSupporterService.getByClub(1);
            expect(result.length).toEqual(1);
            for (const club_supporterResult of result) {
                expect(club_supporterResult).toEqual({
                    ...defaultClubSupporter,
                    playerId: expect.any(Number),
                    clubId: 1
                } as club_supporter);
            }
        });

        it('should return an empty list when retrieving club_supporters for rater id 101', async () => {
            const result = await ClubSupporterService.getByClub(101);
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.club_supporter.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(clubSupporterList);
            });
        });

        it('should return the correct, complete list of 100 club_supporters', async () => {
            const result = await ClubSupporterService.getAll();
            expect(result.length).toEqual(100);
            expect(result[11].playerId).toEqual(2);
            expect(result[11].clubId).toEqual(12);
        });
    });

    describe('create', () => {
        it('should create an club_supporter', async () => {
            const result = await ClubSupporterService.create(defaultClubSupporter);
            expect(result).toEqual(defaultClubSupporter);
        });

        it('should refuse to create an club_supporter with invalid data', async () => {
            await expect(ClubSupporterService.create(invalidclub_supporter)).rejects.toThrow();
        });

        it('should refuse to create an club_supporter that has the same player ID and rater ID as an existing one', async () => {
            await expect(ClubSupporterService.create({
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create an club_supporter where the combination of player ID and rater ID did not exist', async () => {
            const result = await ClubSupporterService.upsert(defaultClubSupporter);
            expect(result).toEqual(defaultClubSupporter);
        });

        it('should update an existing club_supporter where the combination of player ID and rater ID already existed', async () => {
            const updatedclub_supporter = {
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16,
                in_goal: 7,
            };
            const result = await ClubSupporterService.upsert(updatedclub_supporter);
            expect(result).toEqual(updatedclub_supporter);
        });

        it('should refuse to create an club_supporter with invalid data where the combination of player ID and rater ID did not exist', async () => {
            await expect(ClubSupporterService.create(invalidclub_supporter)).rejects.toThrow();
        });

        it('should refuse to update an club_supporter with invalid data where the combination of player ID and rater ID already existed', async () => {
            await expect(ClubSupporterService.create(invalidclub_supporter)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing club_supporter', async () => {
            await ClubSupporterService.delete(6, 16);
        });

        it('should silently return when asked to delete an club_supporter that does not exist', async () => {
            await ClubSupporterService.delete(7, 16);
        });
    });

    describe('deleteAll', () => {
        it('should delete all club_supporters', async () => {
            await ClubSupporterService.deleteAll();
        });
    });
});
