import { Container } from '@mantine/core';

import { MoneyFormSkeleton } from '@/components/MoneyForm/MoneyFormSkeleton';

/** Skeleton placeholder matching the MoneyForm layout (title + stacked debt rows). */
const Loading = () => (
    <Container size="lg" py="lg">
        <MoneyFormSkeleton />
    </Container>
);

export default Loading;
