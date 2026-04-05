import { Container, Skeleton, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the AdminUserList layout (search + sortable user table). */
const Loading = () => (
    <Container>
        <Skeleton height={36} width="100%" mb="md" />
        <Table mt={20}>
            <TableThead>
                <TableTr>
                    <TableTh><Skeleton height={14} width={80} /></TableTh>
                    <TableTh><Skeleton height={14} width={120} /></TableTh>
                    <TableTh><Skeleton height={14} width={50} /></TableTh>
                    <TableTh><Skeleton height={14} width={80} /></TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {Array.from({ length: 10 }).map((_, i) => (
                    <TableTr key={i}>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} width={40} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
    </Container>
);

export default Loading;
