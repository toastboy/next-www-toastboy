import { FootyTable } from "lib/swr";

const TableQualified = ({ table, year, qualified }: { table: FootyTable, year: number, qualified?: boolean }) => (
    <div>TableQualified (table: {table}, year: {year}, qualified: {qualified ? "true" : "false"})</div>
);
TableQualified.displayName = 'TableQualified';
export default TableQualified;
