import { handleGET } from "lib/api";
import { NextRequest } from "next/server";
import clubService from "services/Club";

/**
 * Generates static parameters for the dynamic route.
 *
 * This function retrieves a list of all clubs using the `clubService` and maps
 * their IDs to an array of objects, each containing an `id` property as a string.
 * These parameters can be used for static site generation.
 *
 * @returns A promise that resolves to an array of objects with `id` properties
 *          as strings, or `null` if no clubs are found.
 */
export async function generateStaticParams() {
    const clubs = await clubService.getAll();

    return clubs ? clubs.map((club) => ({
        id: club.id.toString(),
    })) : null;
}

/**
 * Handles the GET request for retrieving club information by ID.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including the `id` of the club.
 * @returns A response object containing the result of the `clubService.get` method.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => clubService.get(parseInt(params.id)),
        { params },
    );
};
