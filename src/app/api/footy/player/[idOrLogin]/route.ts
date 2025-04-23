import { buildJsonResponse, handleGET } from 'lib/api';
import { getUserRole } from 'lib/authServer';
import { Player } from 'lib/types';
import { NextRequest } from 'next/server';
import playerService from 'services/Player';

/**
 * Builds a JSON response based on the provided player data and the user's role.
 *
 * Depending on the user's role, certain fields in the player data may be omitted
 * to restrict access to sensitive information. For users with the role 'none',
 * fields such as `login`, `email`, `born`, and optionally `firstName` and `lastName`
 * (if the player is anonymous) are removed. Other roles retain all fields.
 *
 * @param data - A partial object of the `Player` type containing player information.
 * @returns A promise that resolves to a JSON response with the modified player data.
 */
async function buildResponse(data: Partial<Player>) {
    switch (await getUserRole()) {
        case 'none':
            data = {
                ...data,
                login: undefined,
                email: undefined,
                born: undefined,
                ...data.anonymous ? { firstName: undefined, lastName: undefined } : {},
                comment: undefined,
            };
            break;

        case 'user':
        case 'admin':
        default:
            break;
    }

    return buildJsonResponse(data);
}

/**
 * Handles the GET request for retrieving a player's information by their ID or login.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `idOrLogin`.
 * @returns A response containing partial player information.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET<Partial<Player>>(() => playerService.getByIdOrLogin(params.idOrLogin), { params }, buildResponse);
};
