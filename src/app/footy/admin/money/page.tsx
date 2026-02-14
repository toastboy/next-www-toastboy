import { Container } from '@mantine/core';

import { payDebt } from '@/actions/payDebt';
import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import moneyService from '@/services/Money';

type PageProps = object;

const Page: React.FC<PageProps> = async () => {
    const debts = await moneyService.getDebts();

    return (
        <Container size="lg" py="lg">
            <MoneyForm
                currentDebts={debts.current}
                historicDebts={debts.historic}
                total={debts.total}
                payDebt={payDebt}
            />
        </Container>
    );
};

export default Page;
