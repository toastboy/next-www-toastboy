import { Container } from '@mantine/core';

import { PickerFormSkeleton } from '@/components/PickerForm/PickerFormSkeleton';

/** Skeleton placeholder matching the PickerPage layout (title + date + picker table + cancel section). */
const Loading = () => (
    <Container size="lg" py="lg">
        <PickerFormSkeleton />
    </Container>
);

export default Loading;
