import { Box, Skeleton, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the PlayerList layout (title + filters + table). */
const Loading = () => (
    <Box>
        <Skeleton height={36} width={160} mb="sm" />
        <Skeleton height={20} width={250} mb="sm" />
        <Skeleton height={36} width="100%" mb="sm" />
        <Skeleton height={24} width={120} mb="sm" />
        <Skeleton height={36} width="100%" mb="md" />
        <Table mt={20}>
            <TableThead>
                <TableTr>
                    <TableTh><Skeleton height={14} width={30} /></TableTh>
                    <TableTh><Skeleton height={14} width={100} /></TableTh>
                    <TableTh><Skeleton height={14} width={80} /></TableTh>
                    <TableTh><Skeleton height={14} width={100} /></TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {Array.from({ length: 15 }).map((_, i) => (
                    <TableTr key={i}>
                        <TableTd><Skeleton height={14} width={20} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
    </Box>
);

export default Loading;
