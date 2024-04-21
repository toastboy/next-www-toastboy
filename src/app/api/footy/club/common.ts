import clubService from 'services/Club';

export async function getClub(id: number) {
    return await clubService.get(id);
}
