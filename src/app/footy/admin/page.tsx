import AdminUpdatePlayerRecords from 'components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import MustBeAdmin from 'components/MustBeAdmin/MustBeAdmin';

const Page: React.FC = () => {
    return (
        <MustBeAdmin>
            <AdminUpdatePlayerRecords />
        </MustBeAdmin>
    );
};

export default Page;
