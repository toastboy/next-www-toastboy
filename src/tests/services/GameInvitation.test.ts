import prisma from 'prisma/prisma';
import { GameInvitationType } from 'prisma/zod/schemas/models/GameInvitation.schema';

import gameInvitationService from '@/services/GameInvitation';
import {
    buildUuidFromIndex,
    defaultGameInvitation,
    defaultGameInvitationList,
} from '@/tests/mocks';


describe('GameInvitationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.gameInvitation.findUnique as jest.Mock).mockImplementation((args: {
            where: { uuid: string }
        }) => {
            const gameInvitation = defaultGameInvitationList.find((invitation) => invitation.uuid === args.where.uuid);
            return Promise.resolve(gameInvitation ?? null);
        });

        (prisma.gameInvitation.create as jest.Mock).mockImplementation((args: { data: GameInvitationType }) => {
            const gameInvitation = defaultGameInvitationList.find((invitation) => invitation.uuid === args.data.uuid);

            if (gameInvitation) {
                return Promise.reject(new Error('invitation already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.gameInvitation.upsert as jest.Mock).mockImplementation((args: {
            where: { uuid: string },
            update: GameInvitationType,
            create: GameInvitationType,
        }) => {
            const gameInvitation = defaultGameInvitationList.find((invitation) => invitation.uuid === args.where.uuid);

            if (gameInvitation) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.gameInvitation.delete as jest.Mock).mockImplementation((args: {
            where: { uuid: string }
        }) => {
            const gameInvitation = defaultGameInvitationList.find((invitation) => invitation.uuid === args.where.uuid);
            return Promise.resolve(gameInvitation ?? null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct game invitation with uuid "12346"', async () => {
            const result = await gameInvitationService.get(defaultGameInvitationList[5].uuid);
            expect(result).toEqual({
                ...defaultGameInvitation,
                uuid: defaultGameInvitationList[5].uuid,
            } as GameInvitationType);
        });

        it('should return null for uuid "6789"', async () => {
            const result = await gameInvitationService.get('6789');
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.gameInvitation.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(defaultGameInvitationList);
            });
        });

        it('should return the correct, complete list of 100 game invitations', async () => {
            const result = await gameInvitationService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].uuid).toEqual(defaultGameInvitationList[11].uuid);
        });
    });

    describe('create', () => {
        it('should create a game invitation', async () => {
            const newInvitation: GameInvitationType = {
                ...defaultGameInvitation,
            };
            const result = await gameInvitationService.create(newInvitation);
            expect(result).toEqual(newInvitation);
        });

        it('should refuse to create a game invitation with invalid data', async () => {
            await expect(gameInvitationService.create({
                ...defaultGameInvitation,
                uuid: '',
            })).rejects.toThrow();
            await expect(gameInvitationService.create({
                ...defaultGameInvitation,
                playerId: -1,
            })).rejects.toThrow();
            await expect(gameInvitationService.create({
                ...defaultGameInvitation,
                gameDayId: -1,
            })).rejects.toThrow();
        });

        it('should refuse to create a game invitation that has the same uuid as an existing one', async () => {
            await expect(gameInvitationService.create({
                ...defaultGameInvitation,
                uuid: buildUuidFromIndex(1),
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a game invitation', async () => {
            const result = await gameInvitationService.upsertByUUID(defaultGameInvitation);
            expect(result).toEqual(defaultGameInvitation);
        });

        it('should update an existing game invitation where one with the uuid already existed', async () => {
            const updatedInvitation: GameInvitationType = {
                ...defaultGameInvitation,
                uuid: buildUuidFromIndex(1),
            };
            const result = await gameInvitationService.upsertByUUID(updatedInvitation);
            expect(result).toEqual(updatedInvitation);
        });
    });

    describe('delete', () => {
        it('should delete an existing game invitation', async () => {
            await gameInvitationService.delete('1234');
            expect(prisma.gameInvitation.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a game invitation that does not exist', async () => {
            await gameInvitationService.delete('6789');
            expect(prisma.gameInvitation.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all game invitations', async () => {
            await gameInvitationService.deleteAll();
            expect(prisma.gameInvitation.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});
