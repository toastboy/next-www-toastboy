import prisma from 'prisma/prisma';
import { ClubSupporterType } from 'prisma/zod/schemas/models/ClubSupporter.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import clubSupporterService from '@/services/ClubSupporter';
import { defaultClubSupporter, defaultClubSupporterList } from '@/tests/mocks/data/clubSupporter';

describe('clubSupporterService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct ClubSupporter for player 6, club 16', async () => {
            (prisma.clubSupporter.findUnique as Mock).mockResolvedValueOnce({
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16,
            });
            const result = await clubSupporterService.get(6, 16);
            expect(result).toEqual({
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16,
            } as ClubSupporterType);
        });

        it('should return null for player 7, club 16', async () => {
            (prisma.clubSupporter.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await clubSupporterService.get(7, 16);
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        it('should retrieve the correct ClubSupporters for player id 1', async () => {
            const playerSupporters = defaultClubSupporterList.filter((clubSupporter) => clubSupporter.playerId === 1);
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce(playerSupporters);
            const result = await clubSupporterService.getByPlayer(1);
            expect(result).toHaveLength(10);
            for (const ClubSupporterResult of result) {
                expect(ClubSupporterResult.playerId).toBe(1);
                expect(typeof ClubSupporterResult.clubId).toBe('number');
            }
        });

        it('should return an empty list when retrieving ClubSupporters for player id 11', async () => {
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce([]);
            const result = await clubSupporterService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getByClub', () => {
        it('should retrieve the correct ClubSupporters for club id 1', async () => {
            const clubSupporters = defaultClubSupporterList.filter((clubSupporter) => clubSupporter.clubId === 1);
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce(clubSupporters);
            const result = await clubSupporterService.getByClub(1);
            expect(result).toHaveLength(1);
            for (const ClubSupporterResult of result) {
                expect(ClubSupporterResult.clubId).toBe(1);
                expect(typeof ClubSupporterResult.playerId).toBe('number');
            }
        });

        it('should return an empty list when retrieving ClubSupporters for club id 101', async () => {
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce([]);
            const result = await clubSupporterService.getByClub(101);
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce(defaultClubSupporterList);
        });

        it('should return the correct, complete list of 100 ClubSupporters', async () => {
            const result = await clubSupporterService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].playerId).toBe(2);
            expect(result[11].clubId).toBe(12);
        });
    });

    describe('create', () => {
        it('should create a ClubSupporter', async () => {
            (prisma.clubSupporter.create as Mock).mockResolvedValueOnce(defaultClubSupporter);
            const result = await clubSupporterService.create(defaultClubSupporter);
            expect(result).toEqual(defaultClubSupporter);
        });

        it('should refuse to create a ClubSupporter with invalid data', async () => {
            await expect(clubSupporterService.create({
                ...defaultClubSupporter,
                playerId: -1,
            })).rejects.toThrow();
            await expect(clubSupporterService.create({
                ...defaultClubSupporter,
                clubId: -1,
            })).rejects.toThrow();
        });

        it('should refuse to create a ClubSupporter that has the same player ID and club ID as an existing one', async () => {
            (prisma.clubSupporter.create as Mock).mockRejectedValueOnce(new Error('ClubSupporter already exists'));
            await expect(clubSupporterService.create({
                ...defaultClubSupporter,
                playerId: 6,
                clubId: 16,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a ClubSupporter where the combination of player ID and club ID did not exist', async () => {
            (prisma.clubSupporter.upsert as Mock).mockResolvedValueOnce(defaultClubSupporter);
            const result = await clubSupporterService.upsert(
                defaultClubSupporter.playerId,
                defaultClubSupporter.clubId,
            );
            expect(result).toEqual(defaultClubSupporter);
        });

        it('should update an existing ClubSupporter where the combination of player ID and club ID already existed', async () => {
            const updatedClubSupporter = {
                playerId: 6,
                clubId: 16,
            };
            (prisma.clubSupporter.upsert as Mock).mockResolvedValueOnce(updatedClubSupporter);
            const result = await clubSupporterService.upsert(
                updatedClubSupporter.playerId,
                updatedClubSupporter.clubId,
            );
            expect(result).toEqual(updatedClubSupporter);
        });
    });

    describe('delete', () => {
        it('should delete an existing ClubSupporter', async () => {
            (prisma.clubSupporter.delete as Mock).mockResolvedValueOnce(defaultClubSupporter);
            await clubSupporterService.delete(6, 16);
            expect(prisma.clubSupporter.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a ClubSupporter that does not exist', async () => {
            (prisma.clubSupporter.delete as Mock).mockResolvedValueOnce(null);
            await clubSupporterService.delete(7, 16);
            expect(prisma.clubSupporter.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all ClubSupporters', async () => {
            (prisma.clubSupporter.deleteMany as Mock).mockResolvedValueOnce({ count: 100 });
            await clubSupporterService.deleteAll();
            expect(prisma.clubSupporter.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});
