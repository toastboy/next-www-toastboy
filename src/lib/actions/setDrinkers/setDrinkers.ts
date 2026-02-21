import 'server-only';

import outcomeService from '@/services/Outcome';
import type { SetDrinkersInput, SetDrinkersResult } from '@/types/actions/SetDrinkers';

interface SetDrinkersDeps {
    outcomeService: Pick<typeof outcomeService, 'getByGameDay' | 'upsert'>;
}

const defaultDeps: SetDrinkersDeps = {
    outcomeService,
};

/**
 * Mirrors the legacy PHP drinkers flow:
 * - clear pub value for every listed player
 * - set selected players to 1 if they were on team A/B, otherwise 2
 */
export async function setDrinkersCore(
    data: SetDrinkersInput,
    deps: SetDrinkersDeps = defaultDeps,
): Promise<SetDrinkersResult> {
    const existingOutcomes = await deps.outcomeService.getByGameDay(data.gameDayId);
    const existingOutcomeByPlayerId = new Map(
        existingOutcomes.map((outcome) => [outcome.playerId, outcome]),
    );

    const uniquePlayers = new Map<number, boolean>();
    for (const player of data.players) {
        uniquePlayers.set(player.playerId, player.drinker);
    }

    const allPlayerIds = new Set<number>([
        ...existingOutcomeByPlayerId.keys(),
        ...uniquePlayers.keys(),
    ]);

    const players = Array.from(allPlayerIds).map((playerId) => ({
        playerId,
        drinker: uniquePlayers.get(playerId) ?? false,
    }));
    const selectedPlayers = players.filter((player) => player.drinker);

    await Promise.all(players.map((player) => deps.outcomeService.upsert({
        gameDayId: data.gameDayId,
        playerId: player.playerId,
        pub: player.drinker ?
            (existingOutcomeByPlayerId.get(player.playerId)?.team ? 1 : 2) :
            null,
    })));

    return {
        gameDayId: data.gameDayId,
        updated: players.length,
        drinkers: selectedPlayers.length,
    };
}
