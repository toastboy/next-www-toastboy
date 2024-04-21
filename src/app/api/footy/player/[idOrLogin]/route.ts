import playerService from 'services/Player';

export async function generateStaticParams() {
    return playerService.getAllIdsAndLogins();
}

export async function GET(
    request: Request,
    { params }: {
        params: {
            idOrLogin: string
        }
    }) {
    // TODO: This ought to be one query. Probably do the whole SWR refactor and
    // then see where we are.
    const { idOrLogin } = params;
    const login = await playerService.getLogin(idOrLogin);

    if (!login) {
        return new Response(`Player ${idOrLogin} not found`, {
            status: 404,
        });
    }

    const player = await playerService.getByLogin(login);
    if (!player) {
        return new Response(`Player ${idOrLogin} not found`, {
            status: 404,
        });
    }

    return new Response(JSON.stringify(player), {
        status: 200,
        headers: {
            'Content-Type': 'text/json',
        },
    });
}
