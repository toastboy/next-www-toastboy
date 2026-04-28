import { TitleWithYearDropdownSkeleton } from '@/components/TitleWithYearDropdown/TitleWithYearDropdownSkeleton';
import { YearTableSkeleton } from '@/components/YearTable/YearTableSkeleton';

const Loading = () => (
    <>
        <TitleWithYearDropdownSkeleton />
        <YearTableSkeleton />
    </>
);

export default Loading;
