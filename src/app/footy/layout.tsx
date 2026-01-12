import { SearchParamErrorNotification } from '@/components/SearchParamErrorNotification/SearchParamErrorNotification';

export default function FootyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SearchParamErrorNotification />
            {children}
        </>
    );
}
