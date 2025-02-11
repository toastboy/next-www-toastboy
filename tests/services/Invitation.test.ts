import { Invitation } from '@prisma/client';
import prisma from 'lib/prisma';
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

const defaultInvitation: Invitation = {
    uuid: '1234',
    playerId: 1,
    gameDayId: 1,
};

const invitationList: Invitation[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultInvitation,
    uuid: `1234${index + 1}`,
}));

describe('InvitationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.invitation.findUnique as jest.Mock).mockImplementation((args: {
            where: { uuid: string }
        }) => {
            const invitation = invitationList.find((invitation) => invitation.uuid === args.where.uuid);
            return Promise.resolve(invitation ? invitation : null);
        });

        (prisma.invitation.create as jest.Mock).mockImplementation((args: { data: Invitation }) => {
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
            update: Invitation,
            create: Invitation,
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
            return Promise.resolve(invitation ? invitation : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct Invitation with uuid "12346"', async () => {
            const result = await invitationService.get('12346');
            expect(result).toEqual({
                ...defaultInvitation,
                uuid: '12346',
            } as Invitation);
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
            if (result) {
                expect(result.length).toEqual(100);
                expect(result[11].uuid).toEqual('123412');
            }
            else {
                throw new Error("Result is null");
            }
        });
    });

    describe('create', () => {
        it('should create a Invitation', async () => {
            const newInvitation: Invitation = {
                ...defaultInvitation,
                uuid: '4567',
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
                uuid: '12341',
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a Invitation', async () => {
            const result = await invitationService.upsert(defaultInvitation);
            expect(result).toEqual(defaultInvitation);
        });

        it('should update an existing Invitation where one with the uuid already existed', async () => {
            const updatedInvitation: Invitation = {
                ...defaultInvitation,
                uuid: '1234',
            };
            const result = await invitationService.upsert(updatedInvitation);
            expect(result).toEqual(updatedInvitation);
        });
    });

    describe('delete', () => {
        it('should delete an existing Invitation', async () => {
            await invitationService.delete('1234');
        });

        it('should silently return when asked to delete a Invitation that does not exist', async () => {
            await invitationService.delete('6789');
        });
    });

    describe('deleteAll', () => {
        it('should delete all Invitations', async () => {
            await invitationService.deleteAll();
        });
    });
});
