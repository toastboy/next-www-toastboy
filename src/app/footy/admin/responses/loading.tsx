import { Container } from '@mantine/core';

import { ResponsesFormSkeleton } from '@/components/ResponsesForm/ResponsesFormSkeleton';

/** Skeleton placeholder matching the ResponsesPage layout (title + search + response group cards). */
const Loading = () => (
    <Container size="lg" py="lg">
        <ResponsesFormSkeleton />
    </Container>
);

export default Loading;
