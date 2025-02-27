import { Player } from 'lib/types';

/**
 * Fetches data from the specified URL and returns it as a typed object.
 *
 * @template T - The type of the data expected to be returned.
 * @param {string} url - The URL to fetch data from. If the URL starts with a '/', it will be removed.
 * @returns {Promise<T>} - A promise that resolves to the fetched data of type T.
 * @throws {Error} - Throws an error if the API_URL is not defined in the environment or if the fetch request fails.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 * }
 *
 * const user = await fetchData<User>('/users/1');
 * console.log(user.name);
 * ```
 */
export async function fetchData<T>(url: string): Promise<T> {
    try {
        const serverUrl: string | undefined = process.env.API_URL;
        if (!serverUrl) {
            throw new Error('API_URL is not defined in the environment');
        }
        if (url.startsWith('/')) {
            url = url.slice(1);
        }
        const response = await fetch(`${serverUrl}/${url}`, { next: { revalidate: 60 } });
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const data: T = await response.json();
        switch (typeof (data) as string) {
            case "Player":
                return parsePlayer(data as unknown as Player) as unknown as T;
            default:
                return data;
        }
    }
    catch (error) {
        console.error('Error fetching ${url}:', error);
        throw error;
    }
}

/**
 * Parses and converts the properties of a Player object to their appropriate types.
 *
 * @param player - The Player object to be parsed.
 * @returns The parsed Player object with properties converted to their appropriate types.
 *
 * The function performs the following conversions:
 * - `id`: Converts to a number if it exists.
 * - `isAdmin`: Converts to a boolean if it exists.
 * - `anonymous`: Converts to a boolean if it exists.
 * - `joined`: Converts to a Date object if it exists.
 * - `finished`: Converts to a Date object if it exists.
 * - `born`: Converts to a Date object if it exists.
 * - `introducedBy`: Converts to a number if it exists.
 */
function parsePlayer(player: Player): Player {
    if (player.id) {
        player.id = Number(player.id);
    }

    if (player.isAdmin) {
        player.isAdmin = Boolean(player.isAdmin);
    }

    if (player.anonymous) {
        player.anonymous = Boolean(player.anonymous);
    }

    if (player.joined) {
        player.joined = new Date(player.joined);
    }

    if (player.finished) {
        player.finished = new Date(player.finished);
    }

    if (player.born) {
        player.born = new Date(player.born);
    }

    if (player.introducedBy) {
        player.introducedBy = Number(player.introducedBy);
    }

    return player;
}
