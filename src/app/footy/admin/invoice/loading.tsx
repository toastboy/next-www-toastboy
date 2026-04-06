import { Container } from '@mantine/core';

import { InvoiceFormSkeleton } from '@/components/InvoiceForm/InvoiceFormSkeleton';

/** Skeleton placeholder matching the InvoiceForm layout (month nav + summary + game table). */
const Loading = () => (
    <Container size="lg" py="lg">
        <InvoiceFormSkeleton />
    </Container>
);

export default Loading;
