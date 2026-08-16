import { sendEnquiry } from '@/actions/sendEnquiry';
import { InfoContent } from '@/components/InfoContent/InfoContent';

export const metadata = { title: 'Info' };

const Page = () => {
    return <InfoContent onSendEnquiry={sendEnquiry} />;
};

export default Page;
