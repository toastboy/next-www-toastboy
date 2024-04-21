import { Outcome } from '@prisma/client';
import TeamPlayer from './TeamPlayer';
import playerRecordService from 'services/PlayerRecord';
import playerService from 'services/Player';

export default async function Team({
    outcomes,
}: {
    outcomes: Outcome[],
}) {
    if (outcomes.length == 0) {
        return null;
    }

    let playerRecords = await playerRecordService.getByGameDay(outcomes[0].gameDayId, 0);
    if (playerRecords) {
        playerRecords = playerRecords.filter((pr) => outcomes.some((o) => o.playerId == pr.playerId));

        const form = [];
        const players = [];

        for (const playerRecord of playerRecords) {
            form.push(await playerService.getForm(playerRecord.playerId, 0, 10));
            players.push(await playerService.getById(playerRecord.playerId));
        }
    }

    return (
        <div className="w-[600px] rounded overflow-hidden shadow-lg">
            {outcomes.map((o) => (
                <TeamPlayer key={o.playerId} idOrLogin={o.playerId.toString()} outcome={o} />
            ))}
        </div >
    );
}
