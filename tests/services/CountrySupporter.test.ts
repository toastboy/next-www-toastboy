import prisma from 'lib/prisma';
import { CountrySupporter } from 'prisma/generated/prisma/client';
import countrySupporterService from 'services/CountrySupporter';

jest.mock('lib/prisma', () => ({
    countrySupporter: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultCountrySupporter: CountrySupporter = {
    playerId: 12,
    countryISOCode: "GB",
};

const countrySupporterList: CountrySupporter[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultCountrySupporter,
    playerId: index % 10 + 1,
    countryISOCode: "GB",
}));

describe('countrySupporterService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.countrySupporter.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                playerId_countryISOCode: {
                    playerId: number,
                    countryISOCode: string
                }
            }
        }) => {
            const countrySupporter = countrySupporterList.find((countrySupporter) => countrySupporter.playerId === args.where.playerId_countryISOCode.playerId && countrySupporter.countryISOCode === args.where.playerId_countryISOCode.countryISOCode);
            return Promise.resolve(countrySupporter ? countrySupporter : null);
        });

        (prisma.countrySupporter.create as jest.Mock).mockImplementation((args: { data: CountrySupporter }) => {
            const CountrySupporter = countrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.data.playerId && CountrySupporter.countryISOCode === args.data.countryISOCode);

            if (CountrySupporter) {
                return Promise.reject(new Error('CountrySupporter already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.countrySupporter.upsert as jest.Mock).mockImplementation((args: {
            where: {
                playerId_countryISOCode: {
                    playerId: number,
                    countryISOCode: string
                }
            },
            update: CountrySupporter,
            create: CountrySupporter,
        }) => {
            const CountrySupporter = countrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.where.playerId_countryISOCode.playerId && CountrySupporter.countryISOCode === args.where.playerId_countryISOCode.countryISOCode);

            if (CountrySupporter) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.countrySupporter.delete as jest.Mock).mockImplementation((args: {
            where: {
                playerId_countryISOCode: {
                    playerId: number,
                    countryISOCode: string
                }
            }
        }) => {
            const CountrySupporter = countrySupporterList.find((CountrySupporter) => CountrySupporter.playerId === args.where.playerId_countryISOCode.playerId && CountrySupporter.countryISOCode === args.where.playerId_countryISOCode.countryISOCode);
            return Promise.resolve(CountrySupporter ? CountrySupporter : null);
        });
    });

    describe('get', () => {
        it('should retrieve the correct CountrySupporter for player 6, country "GB"', async () => {
            const result = await countrySupporterService.get(6, "GB");
            if (result) {
                expect(result).toEqual({
                    ...defaultCountrySupporter,
                    playerId: 6,
                    countryISOCode: "GB",
                } as CountrySupporter);
            }
            else {
                throw new Error("Result is null");
            }
        });

        it('should return null for player 7, country "ZZ"', async () => {
            const result = await countrySupporterService.get(7, "ZZ");
            expect(result).toBeNull();
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.countrySupporter.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(countrySupporterList.filter((CountrySupporter) => CountrySupporter.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct ClubSupporters for player id 1', async () => {
            const result = await countrySupporterService.getByPlayer(1);
            if (result) {
                expect(result.length).toEqual(10);
                for (const ClubSupporterResult of result) {
                    expect(ClubSupporterResult).toEqual({
                        ...defaultCountrySupporter,
                        playerId: 1,
                        countryISOCode: expect.any(String),
                    } as CountrySupporter);
                }
            }
            else {
                throw new Error("Result is null");
            }
        });

        it('should return an empty list when retrieving ClubSupporters for player id 11', async () => {
            const result = await countrySupporterService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getByCountry', () => {
        beforeEach(() => {
            (prisma.countrySupporter.findMany as jest.Mock).mockImplementation((args: { where: { countryISOCode: string } }) => {
                return Promise.resolve(countrySupporterList.filter((CountrySupporter) => CountrySupporter.countryISOCode === args.where.countryISOCode));
            });
        });

        it('should retrieve the correct ClubSupporters for rater id 1', async () => {
            const result = await countrySupporterService.getByCountry("GB");
            if (result) {
                expect(result.length).toEqual(100);
                for (const ClubSupporterResult of result) {
                    expect(ClubSupporterResult).toEqual({
                        ...defaultCountrySupporter,
                        playerId: expect.any(Number),
                        countryISOCode: "GB",
                    } as CountrySupporter);
                }
            }
            else {
                throw new Error("Result is null");
            }
        });

        it('should return an empty list when retrieving ClubSupporters for rater id 101', async () => {
            const result = await countrySupporterService.getByCountry("AZ");
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.countrySupporter.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(countrySupporterList);
            });
        });

        it('should return the correct, complete list of 100 ClubSupporters', async () => {
            const result = await countrySupporterService.getAll();
            if (result) {
                expect(result.length).toEqual(100);
                expect(result[11].playerId).toEqual(2);
                expect(result[11].countryISOCode).toEqual("GB");
            }
            else {
                throw new Error("Result is null");
            }
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
            const result = await countrySupporterService.upsert(defaultCountrySupporter);
            expect(result).toEqual(defaultCountrySupporter);
        });

        it('should update an existing CountrySupporter where the combination of player ID and country ISO code already existed', async () => {
            const updatedClubSupporter = {
                ...defaultCountrySupporter,
                playerId: 6,
                countryISOCode: "GB",
                inGoal: 7,
            };
            const result = await countrySupporterService.upsert(updatedClubSupporter);
            expect(result).toEqual(updatedClubSupporter);
        });
    });

    describe('delete', () => {
        it('should delete an existing CountrySupporter', async () => {
            await countrySupporterService.delete(6, "GB");
        });

        it('should silently return when asked to delete a CountrySupporter that does not exist', async () => {
            await countrySupporterService.delete(7, "GB");
        });
    });

    describe('deleteAll', () => {
        it('should delete all ClubSupporters', async () => {
            await countrySupporterService.deleteAll();
        });
    });
});
