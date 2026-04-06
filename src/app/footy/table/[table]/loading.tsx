import { YearSelectorSkeleton } from '@/components/YearSelector/YearSelectorSkeleton';
import { YearTableSkeleton } from '@/components/YearTable/YearTableSkeleton';

const Loading = () => (
    <>
        <YearSelectorSkeleton />
        <YearTableSkeleton />
    </>
);

export default Loading;
