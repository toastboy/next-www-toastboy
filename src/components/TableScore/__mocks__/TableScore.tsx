import { Props } from "../TableScore";

const TableScore = ({ table, playerRecord }: Props) => (
    <div>TableScore (table: {table}, playerRecord.playerId: {playerRecord.playerId})</div>
);
TableScore.displayName = 'TableScore';
export default TableScore;
