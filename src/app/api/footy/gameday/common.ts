import gameDayService from 'services/GameDay';

export async function getGameDay(id: number) {
    return await gameDayService.get(id);
}
