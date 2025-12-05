import { CountryType } from 'prisma/generated/schemas/models/Country.schema';

import prisma from '@/lib/prisma';
import countryService from '@/services/Country';

import { defaultCountry, defaultCountryList, invalidCountry } from '../mocks/data/country';

jest.mock('lib/prisma', () => ({
    country: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

describe('CountryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.country.findUnique as jest.Mock).mockImplementation((args: {
            where: { isoCode: string }
        }) => {
            const country = defaultCountryList.find((country) => country.isoCode === args.where.isoCode);
            return Promise.resolve(country ?? null);
        });

        (prisma.country.create as jest.Mock).mockImplementation((args: { data: CountryType }) => {
            const country = defaultCountryList.find((country) => country.isoCode === args.data.isoCode);

            if (country) {
                return Promise.reject(new Error('country already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.country.upsert as jest.Mock).mockImplementation((args: {
            where: { isoCode: string },
            update: CountryType,
            create: CountryType,
        }) => {
            const country = defaultCountryList.find((country) => country.isoCode === args.where.isoCode);

            if (country) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.country.delete as jest.Mock).mockImplementation((args: {
            where: { isoCode: string }
        }) => {
            const country = defaultCountryList.find((country) => country.isoCode === args.where.isoCode);
            return Promise.resolve(country ?? null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct country with isoCode "GB-SCO"', async () => {
            const result = await countryService.get("GB-SCT");
            expect(result).toEqual(defaultCountryList[2]);
        });

        it('should return null for isoCode "ZZZ"', async () => {
            const result = await countryService.get("ZZZ");
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.country.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(defaultCountryList);
            });
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
            const result = await countryService.create(newCountry);
            expect(result).toEqual(newCountry);
        });

        it('should refuse to create a country with invalid data', async () => {
            await expect(countryService.create(invalidCountry)).rejects.toThrow();
        });

        it('should refuse to create a country that has the same id as an existing one', async () => {
            await expect(countryService.create({
                ...defaultCountry,
                isoCode: "GB-ENG",
                name: "Engerland",
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a country', async () => {
            const result = await countryService.upsert(defaultCountry);
            expect(result).toEqual(defaultCountry);
        });

        it('should update an existing country where one with the id already existed', async () => {
            const updatedCountry: CountryType = {
                ...defaultCountry,
                isoCode: "GB-ENG",
                name: "England",
            };
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
            await countryService.delete("GB-NIR");
            expect(prisma.country.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a country that does not exist', async () => {
            await countryService.delete("ZIM");
            expect(prisma.country.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all countries', async () => {
            await countryService.deleteAll();
            expect(prisma.country.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});
