import { Center, Container, Skeleton, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the AdminPlayerList layout (title + filter + sortable table). */
const Loading = () => (
    <Container fluid mt="xl">
        <Center>
            <Skeleton height={28} width={200} mb="md" />
        </Center>
        <Stack mb="lg">
            <Skeleton height={20} width={120} />
            <Skeleton height={36} width="100%" />
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <TableThead>
                    <TableTr>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <TableTh key={i}><Skeleton height={14} width={60} /></TableTh>
                        ))}
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <TableTr key={i}>
                            {Array.from({ length: 8 }).map((_, j) => (
                                <TableTd key={j}><Skeleton height={14} /></TableTd>
                            ))}
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
        </Stack>
    </Container>
);

export default Loading;
