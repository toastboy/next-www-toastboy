import prisma from 'prisma/prisma';
import { PlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';
import { PlayerExtraEmailWhereUniqueInputObjectSchema } from 'prisma/zod/schemas/objects/PlayerExtraEmailWhereUniqueInput.schema';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    PlayerExtraEmailCreateOneStrictSchema,
    PlayerExtraEmailUpsertOneStrictSchema,
    type PlayerExtraEmailWriteInput,
    PlayerExtraEmailWriteInputSchema,
} from '@/types/PlayerExtraEmailStrictSchema';

class PlayerExtraEmailService {
    async getByEmail(email: string, verified?: boolean): Promise<PlayerExtraEmailType | null> {
        return await prisma.playerExtraEmail.findFirst({
            where: {
                email,
                ...(verified ? { verifiedAt: { not: null } } : {}),
            },
        });
    }

    async create(data: PlayerExtraEmailWriteInput): Promise<PlayerExtraEmailType> {
        const writeData = PlayerExtraEmailWriteInputSchema.parse(data);
        const args = PlayerExtraEmailCreateOneStrictSchema.parse({ data: writeData });
        return await prisma.playerExtraEmail.create(args);
    }

    async upsert(playerId: number, email: string, verified?: boolean): Promise<PlayerExtraEmailType> {
        const verifiedAt = verified ? new Date() : undefined;
        const writeData = PlayerExtraEmailWriteInputSchema.parse({
            playerId,
            email,
            verifiedAt,
        });
        const args = PlayerExtraEmailUpsertOneStrictSchema.parse({
            where: {
                email: writeData.email,
            },
            create: {
                playerId: writeData.playerId,
                email: writeData.email,
                ...(writeData.verifiedAt ? { verifiedAt: writeData.verifiedAt } : {}),
            },
            update: {
                playerId: writeData.playerId,
                ...(writeData.verifiedAt ? { verifiedAt: writeData.verifiedAt } : {}),
            },
        });
        return await prisma.playerExtraEmail.upsert(args);
    }

    async upsertAll(playerId: number, emails: string[]) {
        await Promise.all(emails.map(
            (email) => this.upsert(playerId, email),
        ));
    }

    async getAll(playerId?: number): Promise<PlayerExtraEmailType[]> {
        return await prisma.playerExtraEmail.findMany({
            where: playerId ? { playerId } : undefined,
        });
    }

    async delete(email: string): Promise<void> {
        try {
            const where = PlayerExtraEmailWhereUniqueInputObjectSchema.parse({ email });
            await prisma.playerExtraEmail.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw error;
        }
    }

    async deleteAll(playerId?: number): Promise<void> {
        await prisma.playerExtraEmail.deleteMany({
            where: playerId ? { playerId } : undefined,
        });
    }

    async deleteExcept(playerId: number, keep: string[]) {
        const currentEmails = await this.getAll(playerId);
        const emailsToDelete = currentEmails
            .filter((current) => !keep.some(
                (email) => email.trim().toLowerCase() === current.email,
            ));
        await Promise.all(emailsToDelete.map((email) => this.delete(email.email)));
    }
}

const playerExtraEmailService = new PlayerExtraEmailService();
export default playerExtraEmailService;
