import prisma from 'lib/prisma';
import { InvitationType } from 'prisma/generated/schemas/models/Invitation.schema';
import invitationService from 'services/Invitation';

jest.mock('lib/prisma', () => ({
    invitation: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultInvitation: InvitationType = {
    uuid: '{123e4567-e89b-12d3-a456-426614174000}',
    playerId: 1,
    gameDayId: 1,
};

const buildUuidFromIndex = (i: number): string => {
    const hex = Math.abs(i).toString(16) || '0';
    const repeated = hex.repeat(Math.ceil(32 / hex.length)).slice(0, 32);
    const uuid = `${repeated.slice(0, 8)}-${repeated.slice(8, 12)}-${repeated.slice(12, 16)}-${repeated.slice(16, 20)}-${repeated.slice(20, 32)}`;
    return `{${uuid}}`;
};

const invitationList: InvitationType[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultInvitation,
    uuid: buildUuidFromIndex(index + 1),
}));

describe('InvitationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.invitation.findUnique as jest.Mock).mockImplementation((args: {
            where: { uuid: string }
        }) => {
            const invitation = invitationList.find((invitation) => invitation.uuid === args.where.uuid);
            return Promise.resolve(invitation ?? null);
        });

        (prisma.invitation.create as jest.Mock).mockImplementation((args: { data: InvitationType }) => {
            const invitation = invitationList.find((invitation) => invitation.uuid === args.data.uuid);

            if (invitation) {
                return Promise.reject(new Error('invitation already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.invitation.upsert as jest.Mock).mockImplementation((args: {
            where: { uuid: string },
            update: InvitationType,
            create: InvitationType,
        }) => {
            const invitation = invitationList.find((invitation) => invitation.uuid === args.where.uuid);

            if (invitation) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.invitation.delete as jest.Mock).mockImplementation((args: {
            where: { uuid: string }
        }) => {
            const invitation = invitationList.find((invitation) => invitation.uuid === args.where.uuid);
            return Promise.resolve(invitation ?? null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct Invitation with uuid "12346"', async () => {
            const result = await invitationService.get(invitationList[5].uuid);
            expect(result).toEqual({
                ...defaultInvitation,
                uuid: invitationList[5].uuid,
            } as InvitationType);
        });

        it('should return null for uuid "6789"', async () => {
            const result = await invitationService.get('6789');
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.invitation.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(invitationList);
            });
        });

        it('should return the correct, complete list of 100 Invitation', async () => {
            const result = await invitationService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].uuid).toEqual(invitationList[11].uuid);
        });
    });

    describe('create', () => {
        it('should create a Invitation', async () => {
            const newInvitation: InvitationType = {
                ...defaultInvitation,
            };
            const result = await invitationService.create(newInvitation);
            expect(result).toEqual(newInvitation);
        });

        it('should refuse to create a Invitation with invalid data', async () => {
            await expect(invitationService.create({
                ...defaultInvitation,
                uuid: '',
            })).rejects.toThrow();
            await expect(invitationService.create({
                ...defaultInvitation,
                playerId: -1,
            })).rejects.toThrow();
            await expect(invitationService.create({
                ...defaultInvitation,
                gameDayId: -1,
            })).rejects.toThrow();
        });

        it('should refuse to create a Invitation that has the same uuid as an existing one', async () => {
            await expect(invitationService.create({
                ...defaultInvitation,
                uuid: buildUuidFromIndex(1),
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a Invitation', async () => {
            const result = await invitationService.upsertByUUID(defaultInvitation);
            expect(result).toEqual(defaultInvitation);
        });

        it('should update an existing Invitation where one with the uuid already existed', async () => {
            const updatedInvitation: InvitationType = {
                ...defaultInvitation,
                uuid: buildUuidFromIndex(1),
            };
            const result = await invitationService.upsertByUUID(updatedInvitation);
            expect(result).toEqual(updatedInvitation);
        });
    });

    describe('delete', () => {
        it('should delete an existing Invitation', async () => {
            await invitationService.delete('1234');
            expect(prisma.invitation.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a Invitation that does not exist', async () => {
            await invitationService.delete('6789');
            expect(prisma.invitation.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all Invitations', async () => {
            await invitationService.deleteAll();
            expect(prisma.invitation.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});
