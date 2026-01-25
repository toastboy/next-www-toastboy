import prisma from 'prisma/prisma';
import { ArseType } from 'prisma/zod/schemas/models/Arse.schema';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import arseService from '@/services/Arse';
import { defaultArse, defaultArseList } from '@/tests/mocks/data/arse';

describe('ArseService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct arse for player 6, rater 16', async () => {
            (prisma.arse.findUnique as Mock).mockResolvedValue({
                ...defaultArse,
                playerId: 6,
                raterId: 16,
            });
            const result = await arseService.get(6, 16);
            expect(prisma.arse.findUnique).toHaveBeenCalledWith({
                where: {
                    playerId_raterId: {
                        playerId: 6,
                        raterId: 16,
                    },
                },
            });
            expect(result).toMatchObject({
                ...defaultArse,
                playerId: 6,
                raterId: 16,
            } as ArseType);
            expect(result?.stamp).toBeInstanceOf(Date);
        });

        it('should return null for player 7, rater 16', async () => {
            (prisma.arse.findUnique as Mock).mockResolvedValue(null);
            const result = await arseService.get(7, 16);
            expect(prisma.arse.findUnique).toHaveBeenCalledWith({
                where: {
                    playerId_raterId: {
                        playerId: 7,
                        raterId: 16,
                    },
                },
            });
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        it('should retrieve the correct arses for player id 1', async () => {
            (prisma.arse.aggregate as Mock).mockResolvedValue({
                _avg: {
                    inGoal: 10,
                    running: 10,
                    shooting: 10,
                    passing: 10,
                    ballSkill: 10,
                    attacking: 10,
                    defending: 10,
                },
            });
            const result = await arseService.getByPlayer(1);
            expect(prisma.arse.aggregate).toHaveBeenCalledWith({
                where: {
                    playerId: 1,
                },
                _avg: {
                    inGoal: true,
                    running: true,
                    shooting: true,
                    passing: true,
                    ballSkill: true,
                    attacking: true,
                    defending: true,
                },
            });
            expect(result?.inGoal).toBe(10);
        });

        it('should return an empty list when retrieving arses for player id 11', async () => {
            (prisma.arse.aggregate as Mock).mockResolvedValue({
                _avg: {
                    inGoal: null,
                    running: null,
                    shooting: null,
                    passing: null,
                    ballSkill: null,
                    attacking: null,
                    defending: null,
                },
            });
            const result = await arseService.getByPlayer(11);
            expect(prisma.arse.aggregate).toHaveBeenCalledWith({
                where: {
                    playerId: 11,
                },
                _avg: {
                    inGoal: true,
                    running: true,
                    shooting: true,
                    passing: true,
                    ballSkill: true,
                    attacking: true,
                    defending: true,
                },
            });
            expect(result?.inGoal).toBeNull();
        });
    });

    describe('getByRater', () => {
        beforeEach(() => {
            (prisma.arse.findMany as Mock).mockImplementation((args: { where: { raterId: number } }) => {
                return Promise.resolve(defaultArseList.filter((arse) => arse.raterId === args.where.raterId));
            });
        });

        it('should retrieve the correct arses for rater id 1', async () => {
            (prisma.arse.findMany as Mock).mockResolvedValue(
                defaultArseList.filter((arse) => arse.raterId === 1),
            );
            const result = await arseService.getByRater(1);
            expect(prisma.arse.findMany).toHaveBeenCalledWith({
                where: {
                    raterId: 1,
                },
            });
            expect(result).toHaveLength(1);
            for (const arseResult of result) {
                const expectedArse = defaultArseList.find((arse) => arse.raterId === 1);
                expect(expectedArse).toBeDefined();
                expect(arseResult).toMatchObject({
                    ...expectedArse,
                    raterId: 1,
                });
                expect(typeof arseResult.playerId).toBe('number');
                expect(arseResult.stamp).toBeInstanceOf(Date);
            }
        });

        it('should return an empty list when retrieving arses for rater id 101', async () => {
            (prisma.arse.findMany as Mock).mockResolvedValue([]);
            const result = await arseService.getByRater(101);
            expect(prisma.arse.findMany).toHaveBeenCalledWith({
                where: {
                    raterId: 101,
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        it('should return the correct, complete list of 100 arses', async () => {
            (prisma.arse.findMany as Mock).mockResolvedValue(defaultArseList);
            const result = await arseService.getAll();
            expect(prisma.arse.findMany).toHaveBeenCalledWith({});
            expect(result).toHaveLength(100);
            expect(result[11].playerId).toBe(2);
            expect(result[41].stamp).toBeInstanceOf(Date);
        });
    });

    describe('create', () => {
        it('should create an arse', async () => {
            (prisma.arse.create as Mock).mockResolvedValue(defaultArse);
            const result = await arseService.create(defaultArse);
            expect(prisma.arse.create).toHaveBeenCalledWith({
                data: defaultArse,
            });
            expect(result).toEqual(defaultArse);
        });

        it('should refuse to create an arse with invalid data', async () => {
            await expect(arseService.create({
                ...defaultArse,
                playerId: -1,
            })).rejects.toThrow();
            await expect(arseService.create({
                ...defaultArse,
                raterId: -1,
            })).rejects.toThrow();
            await expect(arseService.create({
                ...defaultArse,
                inGoal: 11,
            })).rejects.toThrow();
            await expect(arseService.create({
                ...defaultArse,
                running: 11,
            })).rejects.toThrow();
            await expect(arseService.create({
                ...defaultArse,
                shooting: 11,
            })).rejects.toThrow();
            await expect(arseService.create({
                ...defaultArse,
                passing: 11,
            })).rejects.toThrow();
            await expect(arseService.create({
                ...defaultArse,
                ballSkill: 11,
            })).rejects.toThrow();
            await expect(arseService.create({
                ...defaultArse,
                attacking: 11,
            })).rejects.toThrow();
            await expect(arseService.create({
                ...defaultArse,
                defending: 11,
            })).rejects.toThrow();
            expect(prisma.arse.create).not.toHaveBeenCalled();
        });

        it('should refuse to create an arse that has the same player ID and rater ID as an existing one', async () => {
            (prisma.arse.create as Mock).mockRejectedValue(new Error('Arse already exists'));
            await expect(arseService.create({
                ...defaultArse,
                playerId: 6,
                raterId: 16,
            })).rejects.toThrow();
            expect(prisma.arse.create).toHaveBeenCalledWith({
                data: {
                    ...defaultArse,
                    playerId: 6,
                    raterId: 16,
                },
            });
        });
    });

    describe('upsert', () => {
        it('should create an arse where the combination of player ID and rater ID did not exist', async () => {
            (prisma.arse.upsert as Mock).mockResolvedValue(defaultArse);
            const result = await arseService.upsert(defaultArse);
            expect(prisma.arse.upsert).toHaveBeenCalledWith({
                where: {
                    playerId_raterId: {
                        playerId: defaultArse.playerId,
                        raterId: defaultArse.raterId,
                    },
                },
                update: defaultArse,
                create: defaultArse,
            });
            expect(result).toEqual(defaultArse);
        });

        it('should update an existing arse where the combination of player ID and rater ID already existed', async () => {
            const updatedArse = {
                ...defaultArse,
                playerId: 6,
                raterId: 16,
                inGoal: 7,
            };
            (prisma.arse.upsert as Mock).mockResolvedValue(updatedArse);
            const result = await arseService.upsert(updatedArse);
            expect(prisma.arse.upsert).toHaveBeenCalledWith({
                where: {
                    playerId_raterId: {
                        playerId: updatedArse.playerId,
                        raterId: updatedArse.raterId,
                    },
                },
                update: updatedArse,
                create: updatedArse,
            });
            expect(result).toEqual(updatedArse);
        });
    });

    describe('delete', () => {
        it('should delete an existing arse', async () => {
            (prisma.arse.delete as Mock).mockResolvedValue({
                ...defaultArse,
                playerId: 6,
                raterId: 16,
            });
            await arseService.delete(6, 16);
            expect(prisma.arse.delete).toHaveBeenCalledWith({
                where: {
                    playerId_raterId: {
                        playerId: 6,
                        raterId: 16,
                    },
                },
            });
        });

        it('should silently return when asked to delete an arse that does not exist', async () => {
            (prisma.arse.delete as Mock).mockResolvedValue(null);
            await arseService.delete(7, 16);
            expect(prisma.arse.delete).toHaveBeenCalledWith({
                where: {
                    playerId_raterId: {
                        playerId: 7,
                        raterId: 16,
                    },
                },
            });
        });
    });

    describe('deleteAll', () => {
        it('should delete all arses', async () => {
            (prisma.arse.deleteMany as Mock).mockResolvedValue({ count: defaultArseList.length });
            await arseService.deleteAll();
            expect(prisma.arse.deleteMany).toHaveBeenCalledWith();
        });
    });
});
