import { Container } from '@mantine/core';

import { payDebt } from '@/actions/payDebt';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { MoneyForm } from '@/components/MoneyForm/MoneyForm';
import moneyService from '@/services/Money';
import { FootyChannel } from '@/types/FootyChannel';

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
            <AutoRefresh channels={FootyChannel.Money} />
            <MoneyForm
                playerDebts={debts.players}
                payDebt={payDebt}
            />
        </Container>
    );
};

export default MoneyPage;
