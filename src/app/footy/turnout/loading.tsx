import { Paper, Skeleton, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

const Loading = () => (
    <Paper shadow="xl" p="xl">
        <Table>
            <TableThead>
                <TableTr>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <TableTh key={i}>
                            <Skeleton height={14} width={60} />
                        </TableTh>
                    ))}
                </TableTr>
            </TableThead>
            <TableTbody>
                {Array.from({ length: 20 }).map((_, i) => (
                    <TableTr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                            <TableTd key={j}>
                                <Skeleton height={14} />
                            </TableTd>
                        ))}
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
    </Paper>
);

export default Loading;
