import { Flex, Text, Title } from '@mantine/core';

type PageProps = object

export function generateMetadata() {
    return { title: "Toastboy FC Rules" };
}

const Page: React.FC<PageProps> = () => {
    return (
        <>
            <Flex gap="md" align="flex-start" direction="column" p="xl">
                <Title order={1}>Toastboy FC: Rules</Title>

                <Text>Broadly speaking, we want a fast, competitive game with as small a
                    risk of injury as possible. There&apos;s no referee: we call our own
                    mistakes like the gentlemen we are.</Text>

                <Text>Violent conduct is of course not allowed, and results in a
                    direct free kick. For safety reasons, sliding tackles and heading the
                    ball are also banned. Pushing and barging are not allowed: this isn&apos;t
                    a non-contact sport, but we do want to avoid players being bundled
                    into the wall/floor and breaking something.</Text>

                <Text>The ball is not allowed over head height - infringements result
                    in an indirect free kick. The only exception is if the ball goes high
                    off the goalkeeper: if it was a deflection, we play on. If it was
                    deliberate, the goalie gets the ball back. Meint doesn&apos;t like this
                    rule, and I can see his point :-&gt; Practicality dictates that we use
                    the blue line around 3 of the 4 walls in the hall as the &ldquo;official&rdquo;
                    head height, although if the ball hits the nets between the two halves
                    of the hall we have to call that over head height too.</Text>

                <Text>The goalie can&apos;t deliberately leave their area (the red &lsquo;D&rsquo;),
                    and no other player can enter it. If a player&apos;s momentum takes them
                    slightly the wrong side of the line, it will be overlooked.</Text>

                <Text>For all free kicks, defenders must be at least 2 meters away
                    from the ball, or as far as possible if the ball is near the goalie&apos;s
                    area.</Text>

                <Text>Substitutions and goalie changes can happen at any time. By
                    convention, play stops whenever a player has to tie his laces or
                    return the ball to the clodhopping oafs next door who are always
                    hoofing their ball into our half. On hot days we have a quick break
                    half way through the game for drinks.</Text>

                <Text>After every game, we retire to a local pub for a few
                    jars. Cheers!</Text>
            </Flex>
        </>
    );
};

export default Page;
