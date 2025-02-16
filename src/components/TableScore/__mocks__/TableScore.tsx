import { FootyTable, PlayerRecord } from "lib/swr";

const TableScore = ({ table, playerRecord }: { table: FootyTable, playerRecord: PlayerRecord }) => (
    <div>TableScore (table: {table}, playerRecord.playerId: {playerRecord.playerId})</div>
);
TableScore.displayName = 'TableScore';
export default TableScore;
