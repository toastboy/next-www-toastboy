import { Container } from '@mantine/core';

import { recordHallHire } from '@/actions/recordHallHire';
import { updateInvoiceGameDays } from '@/actions/updateInvoiceGameDays';
import { InvoiceForm } from '@/components/InvoiceForm/InvoiceForm';
import gameDayService from '@/services/GameDay';

export const metadata = { title: 'Invoice Check' };

interface InvoicePageProps {
    searchParams: Promise<{ year?: string; month?: string }>;
}

const InvoicePage = async ({ searchParams }: InvoicePageProps) => {
    const params = await searchParams;

    const now = new Date();
    // Default to next month since the invoice covers the coming month's bookings
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const year = params.year ? parseInt(params.year, 10) : nextMonth.getFullYear();
    const month = params.month ? parseInt(params.month, 10) : nextMonth.getMonth() + 1;

    const gameDaysRaw = await gameDayService.getForMonth(year, month);

    // A game day is considered to have a game scheduled if either the 'game'
    // flag is true or if the invitations were sent (mailSent is not null).
    const gameDays = gameDaysRaw.map((gd) => ({
        id: gd.id,
        date: gd.date.toISOString().split('T')[0],
        gameScheduled: gd.game || (gd.mailSent !== null),
    }));

    return (
        <Container size="lg" py="lg">
            <InvoiceForm
                year={year}
                month={month}
                gameDays={gameDays}
                onUpdateGameDays={updateInvoiceGameDays}
                onRecordHallHire={recordHallHire}
            />
        </Container>
    );
};

export default InvoicePage;
