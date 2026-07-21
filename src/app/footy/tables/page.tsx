import { List, ListItem, Paper, Stack, Title } from '@mantine/core';
import Link from 'next/link';

export const metadata = { title: 'Tables' };

const TablesPage = () => {
    return (
        <Stack w="100%" p="xl" align="center">
            <Title order={2} mb="xs" w="100%" ta="center">The League Tables</Title>
            <Paper p="xl" withBorder>
                <List>
                    <ListItem>
                        <Link href="/footy/table/points">Points</Link>{' '}
                        - The Blue Riband table: rewards both winning and attendance.
                    </ListItem>
                    <ListItem>
                        <Link href="/footy/table/averages">Averages</Link>{' '}
                        - Best average points per game.</ListItem>
                    <ListItem>
                        <Link href="/footy/table/stalwart">Stalwart</Link>{' '}
                        - The one you win just by turning up.
                    </ListItem>
                    <ListItem>
                        <Link href="/footy/table/speedy">Captain Speedy</Link>{' '}
                        - Rewards people for responding early to the call for players.
                    </ListItem>
                </List>
            </Paper>
        </Stack>
    );
};

export default TablesPage;
