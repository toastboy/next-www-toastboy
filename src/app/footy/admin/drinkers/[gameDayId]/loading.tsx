import { Container, Group, Skeleton, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the DrinkersForm layout (nav + title + search + table + save). */
const Loading = () => (
    <Container size="lg" py="lg">
        <Group justify="space-between" mb="md">
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={60} />
        </Group>
        <Stack gap="md">
            <Stack gap={4}>
                <Skeleton height={28} width={160} />
                <Skeleton height={18} width={200} />
                <Skeleton height={18} width={120} />
            </Stack>
            <Skeleton height={36} width="100%" />
            <Table withTableBorder>
                <TableThead>
                    <TableTr>
                        <TableTh><Skeleton height={14} width={30} /></TableTh>
                        <TableTh><Skeleton height={14} width={100} /></TableTh>
                        <TableTh><Skeleton height={14} width={80} /></TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <TableTr key={i}>
                            <TableTd><Skeleton height={14} width={20} /></TableTd>
                            <TableTd><Skeleton height={14} /></TableTd>
                            <TableTd><Skeleton height={14} width={40} /></TableTd>
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
            <Skeleton height={36} width={100} />
        </Stack>
    </Container>
);

export default Loading;
