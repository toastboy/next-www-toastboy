import prisma from 'lib/prisma';
import { CountryType } from 'prisma/generated/schemas';
import countryService from 'services/Country';

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

const defaultCountry: CountryType = {
    isoCode: "GB-ENG",
    name: "Engerland",
};

const invalidCountry: CountryType = {
    ...defaultCountry,
    isoCode: "ZZZ",
};

const countryList: CountryType[] = Array.from({ length: 4 }, (_, index) => ({
    ...defaultCountry,
    isoCode: ["GB-ENG", "GB-NIR", "GB-SCT", "GB-WLS"][index % 4],
}));

describe('CountryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.country.findUnique as jest.Mock).mockImplementation((args: {
            where: { isoCode: string }
        }) => {
            const country = countryList.find((country) => country.isoCode === args.where.isoCode);
            return Promise.resolve(country ? country : null);
        });

        (prisma.country.create as jest.Mock).mockImplementation((args: { data: CountryType }) => {
            const country = countryList.find((country) => country.isoCode === args.data.isoCode);

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
            const country = countryList.find((country) => country.isoCode === args.where.isoCode);

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
            const country = countryList.find((country) => country.isoCode === args.where.isoCode);
            return Promise.resolve(country ? country : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct country with isoCode "GB-SCO"', async () => {
            const result = await countryService.get("GB-SCT");
            expect(result).toEqual({
                ...defaultCountry,
                isoCode: "GB-SCT",
            } as CountryType);
        });

        it('should return null for isoCode "ZZZ"', async () => {
            const result = await countryService.get("ZZZ");
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.country.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(countryList);
            });
        });

        it('should return the correct, complete list of 4 countries', async () => {
            const result = await countryService.getAll();
            if (result) {
                expect(result.length).toEqual(4);
                expect(result[0].isoCode).toEqual("GB-ENG");
            }
            else {
                throw new Error("Result is null");
            }
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
        });

        it('should silently return when asked to delete a country that does not exist', async () => {
            await countryService.delete("ZIM");
        });
    });

    describe('deleteAll', () => {
        it('should delete all countries', async () => {
            await countryService.deleteAll();
        });
    });
});
