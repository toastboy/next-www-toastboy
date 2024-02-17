import { NextRequest, NextResponse } from "next/server";
import arseService from "lib/arse";
import debug from 'debug';

const log = debug('footy:api');

export async function GET(
    request: NextRequest,
    { params }: {
        params: { id: string }
    }
) {
    try {
        const { id } = params;
        const arse = await arseService.get(Number(id));
        return NextResponse.json(arse);
    } catch (error) {
        log('Error in GET:', error);
        return new NextResponse('Error fetching data', { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: {
        params: { id: string }
    }
) {
    try {
        const { id } = params;
        await arseService.delete(Number(id));
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        log('Error in DELETE:', error);
        return new NextResponse('Error deleting data', { status: 500 });
    }
}
