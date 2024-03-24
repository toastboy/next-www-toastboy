// Note: this isn't yet in use

import { PrismaClient } from '@prisma/client';
import { Arse } from '@prisma/client';

const defaultArse: Arse = {
    stamp: new Date(),
    playerId: 12,
    raterId: 12,
    in_goal: 10,
    running: 10,
    shooting: 10,
    passing: 10,
    ball_skill: 10,
    attacking: 10,
    defending: 10,
};

const arseList: Arse[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultArse,
    playerId: index % 10 + 1,
    raterId: index + 1,
}));

// Mock factory for Arse
export const mockArse = () => ({
    findUnique: jest.fn().mockImplementation((args: {
        where: {
            playerId_raterId: {
                playerId: number,
                raterId: number
            }
        }
    }) => {
        const arse = arseList.find((arse) =>
            arse.playerId === args.where.playerId_raterId.playerId &&
            arse.raterId === args.where.playerId_raterId.raterId
        );
        return Promise.resolve(arse ? arse : null);
    }),

    create: jest.fn().mockImplementation((args: { data: Arse }) => {
        const arse = arseList.find((arse) =>
            arse.playerId === args.data.playerId &&
            arse.raterId === args.data.raterId
        );

        if (arse) {
            return Promise.reject(new Error('Arse already exists'));
        }
        else {
            return Promise.resolve(args.data);
        }
    }),

    upsert: jest.fn().mockImplementation((args: {
        where: {
            playerId_raterId: {
                playerId: number,
                raterId: number
            }
        },
        update: Arse,
        create: Arse,
    }) => {
        const arse = arseList.find((arse) =>
            arse.playerId === args.where.playerId_raterId.playerId &&
            arse.raterId === args.where.playerId_raterId.raterId
        );

        if (arse) {
            return Promise.resolve(args.update);
        }
        else {
            return Promise.resolve(args.create);
        }
    }),

    delete: jest.fn().mockImplementation((args: {
        where: {
            playerId_raterId: {
                playerId: number,
                raterId: number
            }
        }
    }) => {
        const arse = arseList.find((arse) =>
            arse.playerId === args.where.playerId_raterId.playerId &&
            arse.raterId === args.where.playerId_raterId.raterId
        );
        return Promise.resolve(arse ? arse : null);
    }),
});

export const prisma = new PrismaClient();
