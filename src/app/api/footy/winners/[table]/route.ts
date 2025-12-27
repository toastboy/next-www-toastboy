import { NextRequest } from 'next/server';
import { TableNameSchema } from 'prisma/zod/schemas/enums/TableName.schema';

import { handleGET } from '@/lib/api';
import playerRecordService from '@/services/PlayerRecord';

/**
 * Handles the GET request for fetching the winners from a specified table.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including the table name.
 *
 * @returns A promise resolving to a response containing an array of player records with associated player data.
 *
 * The function retrieves the winners from the specified table using the `playerRecordService.getWinners` method.
 * It also sanitizes the response data using the `sanitizePlayerRecordWithPlayerArrayData` function.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        () => playerRecordService.getWinners(
            TableNameSchema.parse(params.table),
        ),
        { params },
    );
};
