import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import playerRecordService from 'services/PlayerRecord';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    /**
     * Represents the parameters passed to the API route.
     * This object is awaited to retrieve the necessary route parameters.
     */
    const params = await props.params;
    return handleGET(
        () => playerRecordService.getProgress(),
        { params },
    );
};
