import { Flex, Group, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the InvoiceForm component layout (title + month nav + game day rows). */
export const InvoiceFormSkeleton = () => (
    <Stack data-testid="skeleton-invoice-form" gap="md">
        <Stack align="flex-start" gap="xs">
            <Skeleton height={28} width={160} />
            <Skeleton height={18} width={320} />
        </Stack>
        <Group justify="space-between" wrap="wrap">
            <Skeleton height={36} width={110} />
            <Skeleton height={28} width={160} />
            <Skeleton height={36} width={110} />
        </Group>
        <Stack gap="sm">
            {Array.from({ length: 5 }).map((_, i) => (
                <Flex key={i} align="center" gap="sm" bd="1px solid var(--mantine-color-gray-3)" p="sm" bdrs="sm">
                    <Skeleton height={14} width={100} />
                    <Skeleton height={20} width={20} />
                    <Skeleton height={36} width="8em" />
                </Flex>
            ))}
        </Stack>
    </Stack>
);
