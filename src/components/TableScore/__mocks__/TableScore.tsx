import { FootyPlayerRecord, FootyTable } from "lib/swr";

const TableScore = ({ table, playerRecord }: { table: FootyTable, playerRecord: FootyPlayerRecord }) => (
    <div>TableScore (table: {table}, playerRecord.playerId: {playerRecord.playerId})</div>
);
TableScore.displayName = 'TableScore';
export default TableScore;
