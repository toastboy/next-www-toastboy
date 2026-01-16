import type { Props } from '../DownloadMyData';

export const DownloadMyData = (props: Props) => (
    <div>DownloadMyData: {JSON.stringify(props)}</div>
);

DownloadMyData.displayName = 'DownloadMyData';

export default DownloadMyData;
