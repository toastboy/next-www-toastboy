const PlayerResults = ({ idOrLogin, games }: { idOrLogin: string, games: number }) => (
    <div>PlayerResults (idOrLogin: {idOrLogin}, games: {games})</div>
);
PlayerResults.displayName = 'PlayerResults';
export default PlayerResults;
