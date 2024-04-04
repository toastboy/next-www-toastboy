import { AdminUpdatePlayerRecords } from "components/AdminUpdatePlayerRecords";
import { AdminExportPlayerRecords } from "components/AdminExportPlayerRecords";

export default function Page() {
    return (
        <div>
            <AdminUpdatePlayerRecords />
            <AdminExportPlayerRecords />
        </div>
    );
}
