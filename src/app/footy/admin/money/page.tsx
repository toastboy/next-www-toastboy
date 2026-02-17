import { Container } from '@mantine/core';

import { payDebt } from '@/actions/payDebt';
import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import moneyService from '@/services/Money';

type PageProps = object;

const Page: React.FC<PageProps> = async () => {
    const balances = await moneyService.getBalances();

    return (
        <Container size="lg" py="lg">
            <MoneyForm
                playerBalances={balances.players}
                clubBalance={balances.club}
                total={balances.total}
                positiveTotal={balances.positiveTotal}
                negativeTotal={balances.negativeTotal}
                payDebt={payDebt}
            />
        </Container>
    );
};

export default Page;
