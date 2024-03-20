import { Player } from '@prisma/client';
import arseService from 'services/Arse';

export default async function PlayerArse({
    player,
}: {
    player: Player,
}) {
    type SkillField = 'in_goal' | 'running' | 'shooting' | 'passing' | 'ball_skill' | 'attacking' | 'defending';

    const arses = await arseService.getByPlayer(player.id);

    if (!arses || arses.length === 0) {
        return null;
    }

    const average = (field: SkillField) => {
        const sum = arses.reduce((acc, arse) => {
            const fieldValue = arse[field];
            if (fieldValue !== null) {
                return acc + fieldValue;
            } else {
                return acc;
            }
        }, 0);
        return sum / arses.length;
    };
    const fields: SkillField[] = ['in_goal', 'running', 'shooting', 'passing', 'ball_skill', 'attacking', 'defending'];
    const fieldAverages = fields.map((field) => average(field));

    return (
        <div className="px-6 py-4">
            <p className="text-gray-700 text-base">In Goal: {fieldAverages[0]}</p>
            <p className="text-gray-700 text-base">Running: {fieldAverages[1]}</p>
            <p className="text-gray-700 text-base">Shooting: {fieldAverages[2]}</p>
            <p className="text-gray-700 text-base">Passing: {fieldAverages[3]}</p>
            <p className="text-gray-700 text-base">Ball Skill: {fieldAverages[4]}</p>
            <p className="text-gray-700 text-base">Attacking: {fieldAverages[5]}</p>
            <p className="text-gray-700 text-base">Defending: {fieldAverages[6]}</p>
        </div>
    );
}
