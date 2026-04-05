import { Container, Paper, Skeleton, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the InvoiceForm layout (month nav + summary + game table). */
const Loading = () => (
    <Container size="lg" py="lg">
        <Stack gap="xl" w="60%" mx="auto" my="xl">
            <Skeleton height={28} width={200} mx="auto" />
            <Skeleton height={36} width="100%" />
            <Paper withBorder p="md">
                <Skeleton height={20} width="60%" />
            </Paper>
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh><Skeleton height={14} width={60} /></TableTh>
                        <TableTh><Skeleton height={14} width={80} /></TableTh>
                        <TableTh><Skeleton height={14} width={60} /></TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableTr key={i}>
                            <TableTd><Skeleton height={14} /></TableTd>
                            <TableTd><Skeleton height={14} width={40} /></TableTd>
                            <TableTd><Skeleton height={14} /></TableTd>
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
        </Stack>
    </Container>
);

export default Loading;
