import { permanentRedirect } from 'next/navigation';

export default async function Page() {
    permanentRedirect(`/footy/table/points`);
}
