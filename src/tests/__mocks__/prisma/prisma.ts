const makeModelMock = () => ({
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
});

const prisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
    $queryRawUnsafe: jest.fn(),
    $executeRawUnsafe: jest.fn(),
    arse: makeModelMock(),
    club: makeModelMock(),
    clubSupporter: makeModelMock(),
    country: makeModelMock(),
    countrySupporter: makeModelMock(),
    gameChat: makeModelMock(),
    gameDay: makeModelMock(),
    gameInvitation: makeModelMock(),
    outcome: makeModelMock(),
    player: makeModelMock(),
    playerEmail: makeModelMock(),
    playerInvitation: makeModelMock(),
    playerLogin: makeModelMock(),
    playerRecord: makeModelMock(),
    user: makeModelMock(),
};

export default prisma;
