import prisma from 'prisma/prisma';
import { CountryType } from 'prisma/zod/schemas/models/Country.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import countryService from '@/services/Country';
import { defaultCountry, defaultCountryList, invalidCountry } from '@/tests/mocks';



describe('CountryService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct country with isoCode "GB-SCO"', async () => {
            (prisma.country.findUnique as Mock).mockResolvedValueOnce(defaultCountryList[2]);
            const result = await countryService.get("GB-SCT");
            expect(result).toEqual(defaultCountryList[2]);
        });

        it('should return null for isoCode "ZZZ"', async () => {
            (prisma.country.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await countryService.get("ZZZ");
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.country.findMany as Mock).mockResolvedValueOnce(defaultCountryList);
        });

        it('should return the correct, complete list of 4 countries', async () => {
            const result = await countryService.getAll();
            expect(result).toHaveLength(4);
            expect(result[0].isoCode).toBe("GB-ENG");
        });
    });

    describe('create', () => {
        it('should create a country', async () => {
            const newCountry: CountryType = {
                ...defaultCountry,
                isoCode: "IT",
                name: "Italia",
            };
            (prisma.country.create as Mock).mockResolvedValueOnce(newCountry);
            const result = await countryService.create(newCountry);
            expect(result).toEqual(newCountry);
        });

        it('should refuse to create a country with invalid data', async () => {
            await expect(countryService.create(invalidCountry)).rejects.toThrow();
        });

        it('should refuse to create a country that has the same id as an existing one', async () => {
            (prisma.country.create as Mock).mockRejectedValueOnce(new Error('country already exists'));
            await expect(countryService.create({
                ...defaultCountry,
                isoCode: "GB-ENG",
                name: "Engerland",
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a country', async () => {
            (prisma.country.upsert as Mock).mockResolvedValueOnce(defaultCountry);
            const result = await countryService.upsert(defaultCountry);
            expect(result).toEqual(defaultCountry);
        });

        it('should update an existing country where one with the id already existed', async () => {
            const updatedCountry: CountryType = {
                ...defaultCountry,
                isoCode: "GB-ENG",
                name: "England",
            };
            (prisma.country.upsert as Mock).mockResolvedValueOnce(updatedCountry);
            const result = await countryService.upsert(updatedCountry);
            expect(result).toEqual(updatedCountry);
        });

        it('should refuse to create a country with invalid data where one with the id did not exist', async () => {
            await expect(countryService.create(invalidCountry)).rejects.toThrow();
        });

        it('should refuse to update a country with invalid data where one with the id already existed', async () => {
            await expect(countryService.create(invalidCountry)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing country', async () => {
            (prisma.country.delete as Mock).mockResolvedValueOnce(defaultCountry);
            await countryService.delete("GB-NIR");
            expect(prisma.country.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a country that does not exist', async () => {
            (prisma.country.delete as Mock).mockResolvedValueOnce(null);
            await countryService.delete("ZIM");
            expect(prisma.country.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all countries', async () => {
            (prisma.country.deleteMany as Mock).mockResolvedValueOnce({ count: 4 });
            await countryService.deleteAll();
            expect(prisma.country.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});
