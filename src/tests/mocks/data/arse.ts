import { ArseType } from "prisma/generated/schemas/models/Arse.schema";

export const defaultArse: ArseType = {
    id: 1,
    stamp: new Date(),
    playerId: 12,
    raterId: 12,
    inGoal: 10,
    running: 10,
    shooting: 10,
    passing: 10,
    ballSkill: 10,
    attacking: 10,
    defending: 10,
};

export const createMockArse = (overrides: Partial<ArseType> = {}): ArseType => ({
    ...defaultArse,
    ...overrides,
});

export const defaultArseList: ArseType[] = Array.from({ length: 100 }, (_, index) =>
    createMockArse({
        playerId: index % 10 + 1,
        raterId: index + 1,
    }),
);
