export default function Page({
    params,
}: {
    params: {
        login: string,
        year: string,
    },
}) {
    return <h1>{params.login} - {params.year}</h1>
}
