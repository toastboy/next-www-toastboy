import { NextRequest, NextResponse } from "next/server";
import arseService from "lib/arse";

export async function GET(
    request: NextRequest,
    { params }: {
        params: { id: string }
    }
) {
    try {
        const { id } = params;
        const arse = await arseService.get(Number(id));
        return NextResponse.json({ arse });
    } catch (error) {
        console.error('Error in GET:', error);
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
        console.error('Error in DELETE:', error);
        return new NextResponse('Error deleting data', { status: 500 });
    }
}
