import prisma from 'prisma/prisma';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import clubService from '@/services/Club';
import { createMockClub, defaultClub, defaultClubList, invalidClub } from '@/tests/mocks/data/club';

describe('ClubService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct club with id 6', async () => {
            (prisma.club.findUnique as Mock).mockResolvedValueOnce(
                createMockClub({ id: 6, soccerwayId: 1005 }),
            );
            const result = await clubService.get(6);
            expect(result).toEqual({
                ...defaultClub,
                id: 6,
                soccerwayId: 1005,
            } as ClubType);
        });

        it('should return null for id 107', async () => {
            (prisma.club.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await clubService.get(107);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.club.findMany as Mock).mockResolvedValueOnce(defaultClubList);
        });

        it('should return the correct, complete list of 100 clubs', async () => {
            const result = await clubService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].id).toBe(12);
            expect(result[11].soccerwayId).toBe(1011);
        });
    });

    describe('create', () => {
        it('should create a club', async () => {
            const newClub: ClubType = {
                ...defaultClub,
                id: 106,
                soccerwayId: 1005,
            };
            (prisma.club.create as Mock).mockResolvedValueOnce(newClub);
            const result = await clubService.create(newClub);
            expect(result).toEqual(newClub);
        });

        it('should refuse to create a club with invalid data', async () => {
            await expect(clubService.create(invalidClub)).rejects.toThrow();
        });

        it('should refuse to create a club that has the same id as an existing one', async () => {
            (prisma.club.create as Mock).mockRejectedValueOnce(new Error('club already exists'));
            await expect(clubService.create({
                ...defaultClub,
                id: 6,
                soccerwayId: 1005,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a club', async () => {
            (prisma.club.upsert as Mock).mockResolvedValueOnce(defaultClub);
            const result = await clubService.upsert(defaultClub);
            expect(result).toEqual(defaultClub);
        });

        it('should update an existing club where one with the id already existed', async () => {
            const updatedClub: ClubType = {
                ...defaultClub,
                id: 6,
                soccerwayId: 1006,
                clubName: "Doddington Rovers",
                uri: "doddington-rovers",
            };
            (prisma.club.upsert as Mock).mockResolvedValueOnce(updatedClub);
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
            (prisma.club.delete as Mock).mockResolvedValueOnce(defaultClub);
            await clubService.delete(6);
            expect(prisma.club.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a club that does not exist', async () => {
            (prisma.club.delete as Mock).mockResolvedValueOnce(null);
            await clubService.delete(107);
            expect(prisma.club.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all clubs', async () => {
            (prisma.club.deleteMany as Mock).mockResolvedValueOnce({ count: 100 });
            await clubService.deleteAll();
            expect(prisma.club.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});
