const playerRecordService = {
    getAll: jest.fn(),
    getAllYears: jest.fn(),
    getForYearByPlayer: jest.fn(),
    getProgress: jest.fn(),
    getTable: jest.fn(),
    getWinners: jest.fn(),
    deleteAll: jest.fn(),
    upsertForGameDay: jest.fn(),
};

export default playerRecordService;
