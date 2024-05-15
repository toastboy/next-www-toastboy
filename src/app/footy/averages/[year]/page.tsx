import { permanentRedirect } from 'next/navigation';

export default async function Page({
    params,
}: {
    params: Record<string, string>,
}) {
    permanentRedirect(`/footy/table/averages/${params.year}`);
}
