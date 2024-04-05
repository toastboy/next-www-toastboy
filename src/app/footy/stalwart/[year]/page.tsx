import { permanentRedirect } from 'next/navigation';

export default async function Page({
    params,
}: {
    params: { year: string },
}): Promise<JSX.Element> {
    permanentRedirect(`/footy/table/stalwart/${params.year}`);
}
