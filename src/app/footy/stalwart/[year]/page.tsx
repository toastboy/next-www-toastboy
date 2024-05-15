import { permanentRedirect } from 'next/navigation';

export default async function Page({
    params,
}: {
    params: Record<string, string>,
}) {
    permanentRedirect(`/footy/table/stalwart/${params.year}`);
}
