import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import clubService from '@/services/Club';
import { createMockClub, defaultClub, defaultClubList, invalidClub } from '@/tests/mocks/data/club';
import type { ClubCreateWriteInput, ClubUpsertInput } from '@/types/ClubStrictSchema';

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
            const newClub: ClubCreateWriteInput = {
                soccerwayId: 1005,
                clubName: defaultClub.clubName,
                uri: defaultClub.uri,
                country: defaultClub.country,
            };
            (prisma.club.create as Mock).mockResolvedValueOnce({
                ...newClub,
                id: 106,
            });
            const result = await clubService.create(newClub);
            expect(result).toEqual({
                ...newClub,
                id: 106,
            });
        });

        it('should refuse to create a club with invalid data', async () => {
            await expect(clubService.create({
                ...invalidClub,
                clubName: 'x'.repeat(256),
            } as unknown as ClubCreateWriteInput)).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a club with a database-generated id when where.id is missing', async () => {
            (prisma.club.upsert as Mock).mockResolvedValueOnce({
                ...defaultClub,
                id: 101,
            });
            const input: ClubUpsertInput = {
                id: 1001,
                soccerwayId: defaultClub.soccerwayId,
                clubName: defaultClub.clubName,
                uri: defaultClub.uri,
                country: defaultClub.country,
            };
            const result = await clubService.upsert(input);
            expect(result).toEqual({
                ...defaultClub,
                id: 101,
            });
        });

        it('should update an existing club where one with the id already existed', async () => {
            const updatedClub: ClubUpsertInput = {
                id: 6,
                soccerwayId: 1006,
                clubName: "Doddington Rovers",
                uri: "doddington-rovers",
                country: defaultClub.country,
            };
            (prisma.club.upsert as Mock).mockResolvedValueOnce({
                ...updatedClub,
                id: 6,
            });
            const result = await clubService.upsert(updatedClub);
            expect(result).toEqual({
                ...updatedClub,
                id: 6,
            });
        });

        it('should refuse to create a club with invalid data where one with the id did not exist', async () => {
            await expect(clubService.upsert({
                id: -1,
                soccerwayId: defaultClub.soccerwayId,
                clubName: defaultClub.clubName,
                uri: defaultClub.uri,
                country: defaultClub.country,
            } as unknown as ClubUpsertInput)).rejects.toThrow();
        });

        it('should refuse to update a club with invalid data where one with the id already existed', async () => {
            await expect(clubService.upsert({
                id: 6,
                soccerwayId: defaultClub.soccerwayId,
                clubName: 'x'.repeat(256),
                uri: defaultClub.uri,
                country: defaultClub.country,
            } as unknown as ClubUpsertInput)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing club', async () => {
            (prisma.club.delete as Mock).mockResolvedValueOnce(defaultClub);
            await clubService.delete(6);
            expect(prisma.club.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a club that does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.club.delete as Mock).mockRejectedValueOnce(notFoundError);
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
