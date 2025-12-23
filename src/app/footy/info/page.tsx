import { Anchor, Container, Flex, Text, Title } from '@mantine/core';

import { EnquiryForm } from '@/components/EnquiryForm/EnquiryForm';

type InfoPageProps = object

const InfoPage: React.FC<InfoPageProps> = () => {
    return (
        <>
            <Flex gap="md" align="flex-start" direction="column" p="xl">
                <Title order={1}>Toastboy FC: Tuesday Night Football</Title>
                <Text>
                    We play a friendly five-a-side footy game amongst ourselves every Tuesday night between 6 and 7pm at the <Anchor href='http://www.kelseykerridge.co.uk/'>Kelsey Kerridge Sports Centre</Anchor> in Cambridge (for our international visitors, that&apos;s &ldquo;soccer&rdquo;, &ldquo;center&rdquo; and &ldquo;Cambridge, England&rdquo;).
                </Text>
                <Container fluid>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2445.3263160975907!2d0.1279577126825085!3d52.20111725967227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8709a9a53b7ff%3A0x34e196dca006ac25!2sKelsey%20Kerridge%20Sports%20Centre!5e0!3m2!1sen!2suk!4v1716736866954!5m2!1sen!2suk"
                        width="100%"
                        height="450"
                        allowFullScreen={true}
                        title="Kelsey Kerridge Sports Centre"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </Container>
                <Text>
                    <Anchor href='/footy/rules'>Here&apos;s an outline of the rules of our games.</Anchor> The standard of play&apos;s not too high, although we&apos;re not complete duffers - but we do play to win. After all, there&apos;s the glory of the trophies which are presented at the sumptuous end-of-year awards ceremonies at stake. Here&apos;s how it works. Every player who&apos;s on the winning team each week gets 3 points, or 1 for a draw. There are 3 trophies up for grabs:
                </Text>
                <Text>
                    <Anchor href='/footy/points'>Points</Anchor>. Simple - whoever has the biggest points total at the end of the year wins the Pewterware.
                </Text>
                <Text>
                    <Anchor href='/footy/averages'>Averages</Anchor>. Just the points total divided by the number of games played, but note you have to have played a minimum of 5 games in a year to qualify.
                </Text>
                <Text>
                    <Anchor href='/footy/stalwart'>Stalwart</Anchor>. To encourage people to play regularly. The winner is the one who&apos;s played the most games in a year.
                </Text>
                <Text>
                    Each week an automated email goes out, inviting players to log in to the site and say whether or not they can play. Once we have enough players, we run the picker script which picks the fairest possible teams based on the age and number of wins in the last 10 games played of each player. I ask for four pounds fifty from each player to cover the cost of the hall booking and things like footballs and bibs. We nearly always go for a pint after the game: everyone is welcome. We usually go to the Grain and Hop Store and then often for a bite to eat.
                </Text>
                <Text>
                    There&apos;s an extra little bonus something at the award ceremony for the person who has the best average response time throughout the year: keep track of where you stand in the <Anchor href='/footy/speedy'>Captain Speedy</Anchor> table.
                </Text>
                <Text>
                    We&apos;re always looking for players, so if you want to join the list, fill in the form below!
                </Text>
                <EnquiryForm />
            </Flex>
        </>
    );
};

export default InfoPage;
