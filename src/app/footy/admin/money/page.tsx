import { Container } from '@mantine/core';

import { payDebt } from '@/actions/payDebt';
import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import moneyService from '@/services/Money';

export const metadata = { title: 'Money' };

/**
 * Money administration page.
 *
 * Displays all players with unpaid game charges and allows admins to record
 * manual payments for each charge, creating transaction records for each
 * associated game day.
 */
const MoneyPage = async () => {
    const debts = await moneyService.getDebts();

    return (
        <Container size="lg" py="lg">
            <MoneyForm
                playerDebts={debts.players}
                total={debts.total}
                positiveTotal={debts.positiveTotal}
                negativeTotal={debts.negativeTotal}
                payDebt={payDebt}
            />
        </Container>
    );
};

export default MoneyPage;
