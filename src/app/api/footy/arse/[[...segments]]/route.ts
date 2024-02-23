import arseService from "lib/arse";
import debug from 'debug';

const log = debug('footy:api');

export async function GET(
    request: Request,
    { params }: { params: { segments?: string[] } }
) {
    try {
        if (!params.segments) {
            const arses = await arseService.getAll();
            return Response.json(arses);
        }
        else {
            const id = params.segments[0];
            const arse = await arseService.get(Number(id));
            return arse ? Response.json(arse) : new Response('Arse not found', { status: 404 });
        }
    } catch (error) {
        log('Error in GET:', error);
        return new Response('Error fetching data', { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { segments?: string[] } }
) {
    try {
        if (!params.segments) {
            await arseService.deleteAll();
        }
        else {
            const id = params.segments[0];
            await arseService.delete(Number(id));
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        log('Error in DELETE:', error);
        return new Response('Error deleting data', { status: 500 });
    }
}
