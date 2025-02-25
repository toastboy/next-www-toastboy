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
        return data;
    }
    catch (error) {
        console.error('Error fetching ${url}:', error);
        throw error;
    }
}
