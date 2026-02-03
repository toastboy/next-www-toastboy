import { NextResponse } from 'next/server';
import { z } from 'zod';

import outcomeService from '@/services/Outcome';

const PayloadSchema = z.object({
    gameDayId: z.number().int().positive(),
    playerId: z.number().int().positive(),
    response: z.enum(['Yes', 'No', 'Dunno']),
    goalie: z.boolean(),
    comment: z.string().max(127).optional().nullable(),
});

export const POST = async (request: Request) => {
    try {
        const json: unknown = await request.json();
        const data = PayloadSchema.parse(json);

        const comment = data.comment?.trim() ?? null;

        await outcomeService.upsert({
            gameDayId: data.gameDayId,
            playerId: data.playerId,
            response: data.response,
            goalie: data.goalie,
            comment: comment && comment.length > 0 ? comment : null,
            responseInterval: null,
        });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        console.error('Failed to update admin response', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message }, { status: 400 });
    }
};
