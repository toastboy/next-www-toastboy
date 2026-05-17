import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import countrySupporterService from '@/services/CountrySupporter';
import { defaultCountry } from '@/tests/mocks/data/country';
import { defaultCountrySupporter, invalidCountrySupporter } from '@/tests/mocks/data/countrySupporter';
import { defaultPlayer } from '@/tests/mocks/data/player';

describe('countrySupporterService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct CountrySupporter for player 6, country "ENG"', async () => {
            (prisma.countrySupporter.findUnique as Mock).mockResolvedValueOnce({
                ...defaultCountrySupporter,
                playerId: 6,
                countryFIFACode: "ENG",
            });
            const result = await countrySupporterService.get(6, "ENG");
            expect(prisma.countrySupporter.findUnique).toHaveBeenCalledWith({
                where: { playerId_countryFIFACode: { playerId: 6, countryFIFACode: "ENG" } },
            });
            expect(result).toEqual({
                ...defaultCountrySupporter,
                playerId: 6,
                countryFIFACode: "ENG",
            });
        });

        it('should return null for player 7, country "ZZZ"', async () => {
            (prisma.countrySupporter.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await countrySupporterService.get(7, "ZZZ");
            expect(prisma.countrySupporter.findUnique).toHaveBeenCalledWith({
                where: { playerId_countryFIFACode: { playerId: 7, countryFIFACode: "ZZZ" } },
            });
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        it('should retrieve CountrySupporters for player id 1', async () => {
            const fixture = [
                { playerId: 1, countryFIFACode: "ENG", country: defaultCountry },
                { playerId: 1, countryFIFACode: "FRA", country: { ...defaultCountry, fifaCode: "FRA", name: "France" } },
            ];
            (prisma.countrySupporter.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await countrySupporterService.getByPlayer(1);
            expect(prisma.countrySupporter.findMany).toHaveBeenCalledWith({
                where: { playerId: 1 },
                include: { country: true },
            });
            expect(result).toEqual(fixture);
        });

        it('should return an empty list when retrieving CountrySupporters for player id 11', async () => {
            (prisma.countrySupporter.findMany as Mock).mockResolvedValueOnce([]);
            const result = await countrySupporterService.getByPlayer(11);
            expect(prisma.countrySupporter.findMany).toHaveBeenCalledWith({
                where: { playerId: 11 },
                include: { country: true },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getByCountry', () => {
        it('should retrieve CountrySupporters for country "ENG"', async () => {
            const fixture = [
                { playerId: 1, countryFIFACode: "ENG" },
                { playerId: 2, countryFIFACode: "ENG" },
            ];
            (prisma.countrySupporter.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await countrySupporterService.getByCountry("ENG");
            expect(prisma.countrySupporter.findMany).toHaveBeenCalledWith({
                where: { countryFIFACode: "ENG" },
            });
            expect(result).toEqual(fixture);
        });

        it('should return an empty list when retrieving CountrySupporters for country "AZE"', async () => {
            (prisma.countrySupporter.findMany as Mock).mockResolvedValueOnce([]);
            const result = await countrySupporterService.getByCountry("AZE");
            expect(prisma.countrySupporter.findMany).toHaveBeenCalledWith({
                where: { countryFIFACode: "AZE" },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getAllWithCountry', () => {
        it('should return all country-supporter rows with country data', async () => {
            const withCountry = [{ ...defaultCountrySupporter, country: defaultCountry }];
            (prisma.countrySupporter.findMany as Mock).mockResolvedValueOnce(withCountry);
            const result = await countrySupporterService.getAllWithCountry();
            expect(result).toHaveLength(1);
            expect(result[0].country).toEqual(defaultCountry);
        });
    });

    describe('getAllWithCountryAndPlayer', () => {
        it('should return all country-supporter rows with country and player data', async () => {
            const withBoth = [{ ...defaultCountrySupporter, country: defaultCountry, player: defaultPlayer }];
            (prisma.countrySupporter.findMany as Mock).mockResolvedValueOnce(withBoth);
            const result = await countrySupporterService.getAllWithCountryAndPlayer();
            expect(result).toHaveLength(1);
            expect(result[0].country).toEqual(defaultCountry);
            expect(result[0].player).toEqual(defaultPlayer);
        });
    });

    describe('getAll', () => {
        it('should return all CountrySupporters', async () => {
            const fixture = [defaultCountrySupporter, { ...defaultCountrySupporter, playerId: 2 }];
            (prisma.countrySupporter.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await countrySupporterService.getAll();
            expect(prisma.countrySupporter.findMany).toHaveBeenCalledWith({});
            expect(result).toEqual(fixture);
        });
    });

    describe('create', () => {
        it('should create a CountrySupporter', async () => {
            (prisma.countrySupporter.create as Mock).mockResolvedValueOnce(defaultCountrySupporter);
            const result = await countrySupporterService.create(defaultCountrySupporter);
            expect(prisma.countrySupporter.create).toHaveBeenCalledWith({
                data: { playerId: defaultCountrySupporter.playerId, countryFIFACode: defaultCountrySupporter.countryFIFACode },
            });
            expect(result).toEqual(defaultCountrySupporter);
        });

        it('should refuse to create a CountrySupporter with invalid data', async () => {
            await expect(countrySupporterService.create({
                ...defaultCountrySupporter,
                playerId: -1,
            })).rejects.toThrow();
            await expect(countrySupporterService.create(invalidCountrySupporter)).rejects.toThrow();
        });

        it('should refuse to create a CountrySupporter that has the same player ID and country FIFA code as an existing one', async () => {
            (prisma.countrySupporter.create as Mock).mockRejectedValueOnce(new Error('CountrySupporter already exists'));
            await expect(countrySupporterService.create({
                ...defaultCountrySupporter,
                playerId: 6,
                countryFIFACode: "ENG",
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a CountrySupporter where the combination of player ID and country FIFA code did not exist', async () => {
            (prisma.countrySupporter.upsert as Mock).mockResolvedValueOnce(defaultCountrySupporter);
            const result = await countrySupporterService.upsert({
                playerId: defaultCountrySupporter.playerId,
                countryFIFACode: defaultCountrySupporter.countryFIFACode,
            });
            expect(prisma.countrySupporter.upsert).toHaveBeenCalledWith({
                where: { playerId_countryFIFACode: { playerId: defaultCountrySupporter.playerId, countryFIFACode: defaultCountrySupporter.countryFIFACode } },
                create: { playerId: defaultCountrySupporter.playerId, countryFIFACode: defaultCountrySupporter.countryFIFACode },
                update: { playerId: defaultCountrySupporter.playerId, countryFIFACode: defaultCountrySupporter.countryFIFACode },
            });
            expect(result).toEqual(defaultCountrySupporter);
        });

        it('should update an existing CountrySupporter where the combination of player ID and country FIFA code already existed', async () => {
            const updatedCountrySupporter = {
                playerId: 6,
                countryFIFACode: "ENG",
            };
            (prisma.countrySupporter.upsert as Mock).mockResolvedValueOnce(updatedCountrySupporter);
            const result = await countrySupporterService.upsert(updatedCountrySupporter);
            expect(prisma.countrySupporter.upsert).toHaveBeenCalledWith({
                where: { playerId_countryFIFACode: { playerId: 6, countryFIFACode: "ENG" } },
                create: { playerId: 6, countryFIFACode: "ENG" },
                update: { playerId: 6, countryFIFACode: "ENG" },
            });
            expect(result).toEqual(updatedCountrySupporter);
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
            (prisma.countrySupporter.delete as Mock).mockResolvedValueOnce({
                ...defaultCountrySupporter,
                playerId: 6,
                countryFIFACode: "ENG",
            });
            await countrySupporterService.delete(6, "ENG");
            expect(prisma.countrySupporter.delete).toHaveBeenCalledWith({
                where: { playerId_countryFIFACode: { playerId: 6, countryFIFACode: "ENG" } },
            });
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
            expect(prisma.countrySupporter.delete).toHaveBeenCalledWith({
                where: { playerId_countryFIFACode: { playerId: 7, countryFIFACode: "ENG" } },
            });
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
        it('should delete all CountrySupporters', async () => {
            (prisma.countrySupporter.deleteMany as Mock).mockResolvedValueOnce({ count: 100 });
            await countrySupporterService.deleteAll();
            expect(prisma.countrySupporter.deleteMany).toHaveBeenCalledTimes(1);
        });

        it('should delete all CountrySupporters for a specific player', async () => {
            (prisma.countrySupporter.deleteMany as Mock).mockResolvedValueOnce({ count: 10 });
            await countrySupporterService.deleteAll(7);
            expect(prisma.countrySupporter.deleteMany).toHaveBeenCalledWith({
                where: {
                    playerId: 7,
                },
            });
        });
    });
});
