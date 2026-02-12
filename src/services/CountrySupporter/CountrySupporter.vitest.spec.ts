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
                playerId_countryISOCode: {
                    playerId: number,
                    countryISOCode: string
                }
            }
        }) => {
            const countrySupporter = defaultCountrySupporterList.find((countrySupporter) => countrySupporter.playerId === args.where.playerId_countryISOCode.playerId && countrySupporter.countryISOCode === args.where.playerId_countryISOCode.countryISOCode);
            return Promise.resolve(countrySupporter ?? null);
        });

        (prisma.countrySupporter.create as Mock).mockImplementation((args: { data: CountrySupporterType }) => {
            const CountrySupporter = defaultCountrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.data.playerId && CountrySupporter.countryISOCode === args.data.countryISOCode);

            if (CountrySupporter) {
                return Promise.reject(new Error('CountrySupporter already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.countrySupporter.upsert as Mock).mockImplementation((args: {
            where: {
                playerId_countryISOCode: {
                    playerId: number,
                    countryISOCode: string
                }
            },
            update: CountrySupporterType,
            create: CountrySupporterType,
        }) => {
            const CountrySupporter = defaultCountrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.where.playerId_countryISOCode.playerId && CountrySupporter.countryISOCode === args.where.playerId_countryISOCode.countryISOCode);

            if (CountrySupporter) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.countrySupporter.delete as Mock).mockImplementation((args: {
            where: {
                playerId_countryISOCode: {
                    playerId: number,
                    countryISOCode: string
                }
            }
        }) => {
            const CountrySupporter = defaultCountrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.where.playerId_countryISOCode.playerId && CountrySupporter.countryISOCode === args.where.playerId_countryISOCode.countryISOCode);
            return Promise.resolve(CountrySupporter ?? null);
        });
    });

    describe('get', () => {
        it('should retrieve the correct CountrySupporter for player 6, country "GB"', async () => {
            const result = await countrySupporterService.get(6, "GB");
            expect(result).toEqual({
                ...defaultCountrySupporter,
                playerId: 6,
                countryISOCode: "GB",
            } as CountrySupporterType);
        });

        it('should return null for player 7, country "ZZ"', async () => {
            const result = await countrySupporterService.get(7, "ZZ");
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
                expect(typeof ClubSupporterResult.countryISOCode).toBe('string');
            }
        });

        it('should return an empty list when retrieving ClubSupporters for player id 11', async () => {
            const result = await countrySupporterService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getByCountry', () => {
        beforeEach(() => {
            (prisma.countrySupporter.findMany as Mock).mockImplementation((args: { where: { countryISOCode: string } }) => {
                return Promise.resolve(defaultCountrySupporterList.filter((CountrySupporter) => CountrySupporter.countryISOCode === args.where.countryISOCode));
            });
        });

        it('should retrieve the correct ClubSupporters for rater id 1', async () => {
            const result = await countrySupporterService.getByCountry("GB");
            expect(result).toHaveLength(100);
            for (const ClubSupporterResult of result) {
                expect(ClubSupporterResult.countryISOCode).toBe("GB");
                expect(typeof ClubSupporterResult.playerId).toBe('number');
            }
        });

        it('should return an empty list when retrieving ClubSupporters for rater id 101', async () => {
            const result = await countrySupporterService.getByCountry("AZ");
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
            expect(result[11].countryISOCode).toBe("GB");
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
                countryISOCode: "XYZ",
            })).rejects.toThrow();
        });

        it('should refuse to create a CountrySupporter that has the same player ID and country ISO code as an existing one', async () => {
            await expect(countrySupporterService.create({
                ...defaultCountrySupporter,
                playerId: 6,
                countryISOCode: "GB",
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a CountrySupporter where the combination of player ID and country ISO code did not exist', async () => {
            const result = await countrySupporterService.upsert(
                {
                    playerId: defaultCountrySupporter.playerId,
                    countryISOCode: defaultCountrySupporter.countryISOCode,
                },
            );
            expect(result).toEqual(defaultCountrySupporter);
        });

        it('should update an existing CountrySupporter where the combination of player ID and country ISO code already existed', async () => {
            const updatedClubSupporter = {
                ...defaultCountrySupporter,
                playerId: 6,
                countryISOCode: "GB",
            };
            const result = await countrySupporterService.upsert(
                {
                    playerId: updatedClubSupporter.playerId,
                    countryISOCode: updatedClubSupporter.countryISOCode,
                },
            );
            expect(result).toEqual(updatedClubSupporter);
        });
    });

    describe('upsertAll', () => {
        it('should upsert each country ISO code for a player', async () => {
            const upsertSpy = vi.spyOn(countrySupporterService, 'upsert').mockResolvedValue({
                ...defaultCountrySupporter,
                playerId: 7,
                countryISOCode: 'GB',
            });

            await countrySupporterService.upsertAll(7, ['GB', 'FR']);

            expect(upsertSpy).toHaveBeenCalledTimes(2);
            expect(upsertSpy).toHaveBeenNthCalledWith(1, { playerId: 7, countryISOCode: 'GB' });
            expect(upsertSpy).toHaveBeenNthCalledWith(2, { playerId: 7, countryISOCode: 'FR' });
            upsertSpy.mockRestore();
        });
    });

    describe('delete', () => {
        it('should delete an existing CountrySupporter', async () => {
            await countrySupporterService.delete(6, "GB");
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
            await countrySupporterService.delete(7, "GB");
            expect(prisma.countrySupporter.delete).toHaveBeenCalledTimes(1);
        });

        it('should rethrow delete errors that are not P2025', async () => {
            (prisma.countrySupporter.delete as Mock).mockRejectedValueOnce(new Error('db exploded'));
            await expect(countrySupporterService.delete(7, 'GB')).rejects.toThrow('db exploded');
        });
    });

    describe('deleteExcept', () => {
        it('should delete only supporters not present in keep list', async () => {
            const getByPlayerSpy = vi.spyOn(countrySupporterService, 'getByPlayer').mockResolvedValueOnce([
                {
                    playerId: 7,
                    countryISOCode: 'GB',
                    country: { ...defaultCountry, isoCode: 'GB' },
                },
                {
                    playerId: 7,
                    countryISOCode: 'FR',
                    country: { ...defaultCountry, isoCode: 'FR', name: 'France' },
                },
            ]);
            const deleteSpy = vi.spyOn(countrySupporterService, 'delete').mockResolvedValue();

            await countrySupporterService.deleteExcept(7, ['GB']);

            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(deleteSpy).toHaveBeenCalledWith(7, 'FR');
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
