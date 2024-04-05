import { permanentRedirect } from 'next/navigation';

export default async function Page(): Promise<JSX.Element> {
    permanentRedirect(`/footy/table/speedy`);
}
