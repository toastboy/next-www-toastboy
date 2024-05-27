import PlayerTile from 'components/PlayerTile';
import playerService from "services/Player";

interface PageProps { }

const Page: React.FC<PageProps> = async () => {
    const players = await playerService.getAll();

    return (
        <div>
            <main className="p-10 mx-auto max-w-4xl">
                <h1 className="text-6xl font-bold mb-4 text-center">Tuesday Footy Players</h1>
                <p className="mb-20 text-xl text-center">
                    🔥 I mean, look at them 🔥
                </p>
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
                    {players.map((player) => (
                        <PlayerTile player={player} key={player.id} />
                    ))}
                </div>
            </main>

            <footer>
            </footer>
        </div>
    );
};

export default Page;
