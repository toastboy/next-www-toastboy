import { authExport } from '@/actions/auth-export';
import { getProgress } from '@/actions/getProgress';
import { updatePlayerRecords } from '@/actions/updatePlayerRecords';
import { AdminDashboard } from '@/components/AdminDashboard/AdminDashboard';

const AdminPage = () => {
    return (
        <AdminDashboard
            onUpdatePlayerRecords={updatePlayerRecords}
            getProgress={getProgress}
            onExportAuth={authExport}
        />
    );
};

export default AdminPage;
