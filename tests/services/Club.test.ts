import prisma from 'lib/prisma';
import { Club } from 'prisma/generated/prisma/client';
import clubService from 'services/Club';

jest.mock('lib/prisma', () => ({
    club: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultClub: Club = {
    id: 1,
    soccerwayId: 1000,
    clubName: "Wittering United",
    uri: "wittering-united",
    country: "england",
};

const invalidClub: Club = {
    ...defaultClub,
    id: -1,
};

const clubList: Club[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultClub,
    id: index + 1,
    soccerwayId: 1000 + index,
}));

describe('ClubService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.club.findUnique as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const club = clubList.find((club) => club.id === args.where.id);
            return Promise.resolve(club ? club : null);
        });

        (prisma.club.create as jest.Mock).mockImplementation((args: { data: Club }) => {
            const club = clubList.find((club) => club.id === args.data.id);

            if (club) {
                return Promise.reject(new Error('club already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.club.upsert as jest.Mock).mockImplementation((args: {
            where: { id: number },
            update: Club,
            create: Club,
        }) => {
            const club = clubList.find((club) => club.id === args.where.id);

            if (club) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.club.delete as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const club = clubList.find((club) => club.id === args.where.id);
            return Promise.resolve(club ? club : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct club with id 6', async () => {
            const result = await clubService.get(6);
            expect(result).toEqual({
                ...defaultClub,
                id: 6,
                soccerwayId: 1005,
            } as Club);
        });

        it('should return null for id 107', async () => {
            const result = await clubService.get(107);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.club.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(clubList);
            });
        });

        it('should return the correct, complete list of 100 clubs', async () => {
            const result = await clubService.getAll();
            if (result) {
                expect(result.length).toEqual(100);
                expect(result[11].id).toEqual(12);
                expect(result[11].soccerwayId).toEqual(1011);
            }
            else {
                throw new Error("Result is null");
            }
        });
    });

    describe('create', () => {
        it('should create a club', async () => {
            const newClub: Club = {
                ...defaultClub,
                id: 106,
                soccerwayId: 1005,
            };
            const result = await clubService.create(newClub);
            expect(result).toEqual(newClub);
        });

        it('should refuse to create a club with invalid data', async () => {
            await expect(clubService.create(invalidClub)).rejects.toThrow();
        });

        it('should refuse to create a club that has the same id as an existing one', async () => {
            await expect(clubService.create({
                ...defaultClub,
                id: 6,
                soccerwayId: 1005,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a club', async () => {
            const result = await clubService.upsert(defaultClub);
            expect(result).toEqual(defaultClub);
        });

        it('should update an existing club where one with the id already existed', async () => {
            const updatedClub: Club = {
                ...defaultClub,
                id: 6,
                soccerwayId: 1006,
                clubName: "Doddington Rovers",
                uri: "doddington-rovers",
            };
            const result = await clubService.upsert(updatedClub);
            expect(result).toEqual(updatedClub);
        });

        it('should refuse to create a club with invalid data where one with the id did not exist', async () => {
            await expect(clubService.create(invalidClub)).rejects.toThrow();
        });

        it('should refuse to update a club with invalid data where one with the id already existed', async () => {
            await expect(clubService.create(invalidClub)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing club', async () => {
            await clubService.delete(6);
        });

        it('should silently return when asked to delete a club that does not exist', async () => {
            await clubService.delete(107);
        });
    });

    describe('deleteAll', () => {
        it('should delete all clubs', async () => {
            await clubService.deleteAll();
        });
    });
});
