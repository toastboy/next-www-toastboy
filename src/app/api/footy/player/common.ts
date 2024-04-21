import playerService from 'services/Player';

export async function getPlayer(idOrLogin: string) {
    // TODO: This ought to be one query. Probably do the whole SWR refactor and
    // then see where we are.
    const login = await playerService.getLogin(idOrLogin);

    return login ? await playerService.getByLogin(login) : null;
}
