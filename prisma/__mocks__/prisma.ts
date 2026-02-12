import { vi } from 'vitest';

const makeModelMock = () => ({
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
    groupBy: vi.fn(),
});

const prisma = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
    $queryRaw: vi.fn(),
    $queryRawUnsafe: vi.fn(),
    $executeRawUnsafe: vi.fn(),
    arse: makeModelMock(),
    club: makeModelMock(),
    clubSupporter: makeModelMock(),
    country: makeModelMock(),
    countrySupporter: makeModelMock(),
    contactEnquiry: makeModelMock(),
    emailVerification: makeModelMock(),
    gameChat: makeModelMock(),
    gameDay: makeModelMock(),
    gameInvitation: makeModelMock(),
    outcome: makeModelMock(),
    player: makeModelMock(),
    playerExtraEmail: makeModelMock(),
    playerLogin: makeModelMock(),
    playerRecord: makeModelMock(),
    user: makeModelMock(),
};

export default prisma;
