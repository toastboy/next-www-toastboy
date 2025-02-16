import { Props } from "../TableQualified";

const TableQualified = ({ table, year, qualified }: Props) => (
    <div>TableQualified (table: {table}, year: {year}, qualified: {qualified ? "true" : "false"})</div>
);
TableQualified.displayName = 'TableQualified';
export default TableQualified;
