import Link from "next/link";

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <>
            <h3>The league tables</h3>

            <ul>
                <li><Link href="/footy/table/points">Points</Link> - The Blue Riband table: rewards both winning and attendance.</li>
                <li><Link href="/footy/table/averages">Averages</Link> - Best average points per game.</li>
                <li><Link href="/footy/table/stalwart">Stalwart</Link> - The one you win just by turning up.</li>
                <li><Link href="/footy/table/speedy">Captain Speedy</Link> - Rewards people for responding early to the call for players.</li>
            </ul>
        </>
    );
};

export default Page;
