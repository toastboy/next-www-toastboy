import type { Metadata } from 'next';

import PrivacyContent from './privacy.mdx';

export const metadata: Metadata = { title: 'Privacy Notice' };

const PrivacyPage = () => <PrivacyContent />;

export default PrivacyPage;
