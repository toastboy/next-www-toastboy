export default function Page({
    params,
}: {
    params: Record<string, string>,
}) {
    return <h1>{params.login} - {params.year}</h1>;
}
