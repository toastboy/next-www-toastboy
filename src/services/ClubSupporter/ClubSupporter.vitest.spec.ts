import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import clubSupporterService from '@/services/ClubSupporter';
import { defaultClub } from '@/tests/mocks/data/club';
import { defaultClubSupporter } from '@/tests/mocks/data/clubSupporter';

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
            });
        });

        it('should return null for player 7, club 16', async () => {
            (prisma.clubSupporter.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await clubSupporterService.get(7, 16);
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        it('should retrieve ClubSupporters for player id 1', async () => {
            const fixture = [
                { playerId: 1, clubId: 10, club: defaultClub },
                { playerId: 1, clubId: 20, club: defaultClub },
            ];
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await clubSupporterService.getByPlayer(1);
            expect(prisma.clubSupporter.findMany).toHaveBeenCalledWith({
                where: { playerId: 1 },
                include: { club: true },
            });
            expect(result).toEqual(fixture);
        });

        it('should return an empty list for player id 11', async () => {
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce([]);
            const result = await clubSupporterService.getByPlayer(11);
            expect(prisma.clubSupporter.findMany).toHaveBeenCalledWith({
                where: { playerId: 11 },
                include: { club: true },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getByClub', () => {
        it('should retrieve ClubSupporters for club id 1', async () => {
            const fixture = [{ playerId: 5, clubId: 1 }];
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await clubSupporterService.getByClub(1);
            expect(prisma.clubSupporter.findMany).toHaveBeenCalledWith({
                where: { clubId: 1 },
            });
            expect(result).toEqual(fixture);
        });

        it('should return an empty list for club id 101', async () => {
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce([]);
            const result = await clubSupporterService.getByClub(101);
            expect(prisma.clubSupporter.findMany).toHaveBeenCalledWith({
                where: { clubId: 101 },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        it('should return all ClubSupporters', async () => {
            const fixture = [
                defaultClubSupporter,
                { ...defaultClubSupporter, playerId: 2, clubId: 3 },
            ];
            (prisma.clubSupporter.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await clubSupporterService.getAll();
            expect(prisma.clubSupporter.findMany).toHaveBeenCalledWith({});
            expect(result).toEqual(fixture);
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
                {
                    playerId: defaultClubSupporter.playerId,
                    clubId: defaultClubSupporter.clubId,
                },
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
                {
                    playerId: updatedClubSupporter.playerId,
                    clubId: updatedClubSupporter.clubId,
                },
            );
            expect(result).toEqual(updatedClubSupporter);
        });
    });

    describe('upsertAll', () => {
        it('should upsert each club id for a player', async () => {
            const upsertSpy = vi.spyOn(clubSupporterService, 'upsert').mockResolvedValue({
                ...defaultClubSupporter,
                playerId: 7,
                clubId: 1,
            });

            await clubSupporterService.upsertAll(7, [1, 2, 3]);

            expect(upsertSpy).toHaveBeenCalledTimes(3);
            expect(upsertSpy).toHaveBeenNthCalledWith(1, { playerId: 7, clubId: 1 });
            expect(upsertSpy).toHaveBeenNthCalledWith(2, { playerId: 7, clubId: 2 });
            expect(upsertSpy).toHaveBeenNthCalledWith(3, { playerId: 7, clubId: 3 });
            upsertSpy.mockRestore();
        });
    });

    describe('delete', () => {
        it('should delete an existing ClubSupporter', async () => {
            (prisma.clubSupporter.delete as Mock).mockResolvedValueOnce(defaultClubSupporter);
            await clubSupporterService.delete(6, 16);
            expect(prisma.clubSupporter.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a ClubSupporter that does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.clubSupporter.delete as Mock).mockRejectedValueOnce(notFoundError);
            await clubSupporterService.delete(7, 16);
            expect(prisma.clubSupporter.delete).toHaveBeenCalledTimes(1);
        });

        it('should rethrow delete errors that are not P2025', async () => {
            (prisma.clubSupporter.delete as Mock).mockRejectedValueOnce(new Error('db exploded'));
            await expect(clubSupporterService.delete(7, 16)).rejects.toThrow('db exploded');
        });
    });

    describe('deleteExcept', () => {
        it('should delete only supporters not present in keep list', async () => {
            const getByPlayerSpy = vi.spyOn(clubSupporterService, 'getByPlayer').mockResolvedValueOnce([
                {
                    playerId: 7,
                    clubId: 1,
                    club: { ...defaultClub, id: 1 },
                },
                {
                    playerId: 7,
                    clubId: 2,
                    club: { ...defaultClub, id: 2 },
                },
            ]);
            const deleteSpy = vi.spyOn(clubSupporterService, 'delete').mockResolvedValue();

            await clubSupporterService.deleteExcept(7, [1]);

            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(deleteSpy).toHaveBeenCalledWith(7, 2);
            deleteSpy.mockRestore();
            getByPlayerSpy.mockRestore();
        });
    });

    describe('deleteAll', () => {
        it('should delete all ClubSupporters', async () => {
            (prisma.clubSupporter.deleteMany as Mock).mockResolvedValueOnce({ count: 100 });
            await clubSupporterService.deleteAll();
            expect(prisma.clubSupporter.deleteMany).toHaveBeenCalledTimes(1);
        });

        it('should delete all ClubSupporters for a specific player', async () => {
            (prisma.clubSupporter.deleteMany as Mock).mockResolvedValueOnce({ count: 10 });
            await clubSupporterService.deleteAll(7);
            expect(prisma.clubSupporter.deleteMany).toHaveBeenCalledWith({
                where: {
                    playerId: 7,
                },
            });
        });
    });
});
