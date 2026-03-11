import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { CountrySupporterType } from 'prisma/zod/schemas/models/CountrySupporter.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import countrySupporterService from '@/services/CountrySupporter';
import { defaultCountry } from '@/tests/mocks/data/country';
import { defaultCountrySupporter, defaultCountrySupporterList } from '@/tests/mocks/data/countrySupporter';

describe('countrySupporterService', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (prisma.countrySupporter.findUnique as Mock).mockImplementation((args: {
            where: {
                playerId_countryFIFACode: {
                    playerId: number,
                    countryFIFACode: string
                }
            }
        }) => {
            const countrySupporter = defaultCountrySupporterList.find((countrySupporter) => countrySupporter.playerId === args.where.playerId_countryFIFACode.playerId && countrySupporter.countryFIFACode === args.where.playerId_countryFIFACode.countryFIFACode);
            return Promise.resolve(countrySupporter ?? null);
        });

        (prisma.countrySupporter.create as Mock).mockImplementation((args: { data: CountrySupporterType }) => {
            const CountrySupporter = defaultCountrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.data.playerId && CountrySupporter.countryFIFACode === args.data.countryFIFACode);

            if (CountrySupporter) {
                return Promise.reject(new Error('CountrySupporter already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.countrySupporter.upsert as Mock).mockImplementation((args: {
            where: {
                playerId_countryFIFACode: {
                    playerId: number,
                    countryFIFACode: string
                }
            },
            update: CountrySupporterType,
            create: CountrySupporterType,
        }) => {
            const CountrySupporter = defaultCountrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.where.playerId_countryFIFACode.playerId && CountrySupporter.countryFIFACode === args.where.playerId_countryFIFACode.countryFIFACode);

            if (CountrySupporter) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.countrySupporter.delete as Mock).mockImplementation((args: {
            where: {
                playerId_countryFIFACode: {
                    playerId: number,
                    countryFIFACode: string
                }
            }
        }) => {
            const CountrySupporter = defaultCountrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.where.playerId_countryFIFACode.playerId && CountrySupporter.countryFIFACode === args.where.playerId_countryFIFACode.countryFIFACode);
            return Promise.resolve(CountrySupporter ?? null);
        });
    });

    describe('get', () => {
        it('should retrieve the correct CountrySupporter for player 6, country "ENG"', async () => {
            const result = await countrySupporterService.get(6, "ENG");
            expect(result).toEqual({
                ...defaultCountrySupporter,
                playerId: 6,
                countryFIFACode: "ENG",
            } as CountrySupporterType);
        });

        it('should return null for player 7, country "ZZZ"', async () => {
            const result = await countrySupporterService.get(7, "ZZZ");
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.countrySupporter.findMany as Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(defaultCountrySupporterList.filter((CountrySupporter) => CountrySupporter.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct ClubSupporters for player id 1', async () => {
            const result = await countrySupporterService.getByPlayer(1);
            expect(result).toHaveLength(10);
            for (const ClubSupporterResult of result) {
                expect(ClubSupporterResult).toMatchObject({
                    ...defaultCountrySupporter,
                    playerId: 1,
                } as CountrySupporterType);
                expect(typeof ClubSupporterResult.countryFIFACode).toBe('string');
            }
        });

        it('should return an empty list when retrieving ClubSupporters for player id 11', async () => {
            const result = await countrySupporterService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getByCountry', () => {
        beforeEach(() => {
            (prisma.countrySupporter.findMany as Mock).mockImplementation((args: { where: { countryFIFACode: string } }) => {
                return Promise.resolve(defaultCountrySupporterList.filter((CountrySupporter) => CountrySupporter.countryFIFACode === args.where.countryFIFACode));
            });
        });

        it('should retrieve the correct ClubSupporters for country "ENG"', async () => {
            const result = await countrySupporterService.getByCountry("ENG");
            expect(result).toHaveLength(100);
            for (const ClubSupporterResult of result) {
                expect(ClubSupporterResult.countryFIFACode).toBe("ENG");
                expect(typeof ClubSupporterResult.playerId).toBe('number');
            }
        });

        it('should return an empty list when retrieving ClubSupporters for country "AZE"', async () => {
            const result = await countrySupporterService.getByCountry("AZE");
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.countrySupporter.findMany as Mock).mockImplementation(() => {
                return Promise.resolve(defaultCountrySupporterList);
            });
        });

        it('should return the correct, complete list of 100 ClubSupporters', async () => {
            const result = await countrySupporterService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].playerId).toBe(2);
            expect(result[11].countryFIFACode).toBe("ENG");
        });
    });

    describe('create', () => {
        it('should create a CountrySupporter', async () => {
            const result = await countrySupporterService.create(defaultCountrySupporter);
            expect(result).toEqual(defaultCountrySupporter);
        });

        it('should refuse to create a CountrySupporter with invalid data', async () => {
            await expect(countrySupporterService.create({
                ...defaultCountrySupporter,
                playerId: -1,
            })).rejects.toThrow();
            await expect(countrySupporterService.create({
                ...defaultCountrySupporter,
                countryFIFACode: "XYZ",
            })).rejects.toThrow();
        });

        it('should refuse to create a CountrySupporter that has the same player ID and country FIFA code as an existing one', async () => {
            await expect(countrySupporterService.create({
                ...defaultCountrySupporter,
                playerId: 6,
                countryFIFACode: "ENG",
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a CountrySupporter where the combination of player ID and country FIFA code did not exist', async () => {
            const result = await countrySupporterService.upsert(
                {
                    playerId: defaultCountrySupporter.playerId,
                    countryFIFACode: defaultCountrySupporter.countryFIFACode,
                },
            );
            expect(result).toEqual(defaultCountrySupporter);
        });

        it('should update an existing CountrySupporter where the combination of player ID and country FIFA code already existed', async () => {
            const updatedClubSupporter = {
                ...defaultCountrySupporter,
                playerId: 6,
                countryFIFACode: "ENG",
            };
            const result = await countrySupporterService.upsert(
                {
                    playerId: updatedClubSupporter.playerId,
                    countryFIFACode: updatedClubSupporter.countryFIFACode,
                },
            );
            expect(result).toEqual(updatedClubSupporter);
        });
    });

    describe('upsertAll', () => {
        it('should upsert each country FIFA code for a player', async () => {
            const upsertSpy = vi.spyOn(countrySupporterService, 'upsert').mockResolvedValue({
                ...defaultCountrySupporter,
                playerId: 7,
                countryFIFACode: 'ENG',
            });

            await countrySupporterService.upsertAll(7, ['ENG', 'FRA']);

            expect(upsertSpy).toHaveBeenCalledTimes(2);
            expect(upsertSpy).toHaveBeenNthCalledWith(1, { playerId: 7, countryFIFACode: 'ENG' });
            expect(upsertSpy).toHaveBeenNthCalledWith(2, { playerId: 7, countryFIFACode: 'FRA' });
            upsertSpy.mockRestore();
        });
    });

    describe('delete', () => {
        it('should delete an existing CountrySupporter', async () => {
            await countrySupporterService.delete(6, "ENG");
            expect(prisma.countrySupporter.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a CountrySupporter that does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.countrySupporter.delete as Mock).mockRejectedValueOnce(notFoundError);
            await countrySupporterService.delete(7, "ENG");
            expect(prisma.countrySupporter.delete).toHaveBeenCalledTimes(1);
        });

        it('should rethrow delete errors that are not P2025', async () => {
            (prisma.countrySupporter.delete as Mock).mockRejectedValueOnce(new Error('db exploded'));
            await expect(countrySupporterService.delete(7, 'ENG')).rejects.toThrow('db exploded');
        });
    });

    describe('deleteExcept', () => {
        it('should delete only supporters not present in keep list', async () => {
            const getByPlayerSpy = vi.spyOn(countrySupporterService, 'getByPlayer').mockResolvedValueOnce([
                {
                    playerId: 7,
                    countryFIFACode: 'ENG',
                    country: { ...defaultCountry, fifaCode: 'ENG' },
                },
                {
                    playerId: 7,
                    countryFIFACode: 'FRA',
                    country: { ...defaultCountry, fifaCode: 'FRA', name: 'France' },
                },
            ]);
            const deleteSpy = vi.spyOn(countrySupporterService, 'delete').mockResolvedValue();

            await countrySupporterService.deleteExcept(7, ['ENG']);

            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(deleteSpy).toHaveBeenCalledWith(7, 'FRA');
            deleteSpy.mockRestore();
            getByPlayerSpy.mockRestore();
        });
    });

    describe('deleteAll', () => {
        it('should delete all ClubSupporters', async () => {
            await countrySupporterService.deleteAll();
            expect(prisma.countrySupporter.deleteMany).toHaveBeenCalledTimes(1);
        });

        it('should delete all ClubSupporters for a specific player', async () => {
            await countrySupporterService.deleteAll(7);
            expect(prisma.countrySupporter.deleteMany).toHaveBeenCalledWith({
                where: {
                    playerId: 7,
                },
            });
        });
    });
});
