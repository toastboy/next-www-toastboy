import { recordHallHire } from '@/actions/recordHallHire';
import { updateInvoiceGameDays } from '@/actions/updateInvoiceGameDays';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { InvoiceForm } from '@/components/InvoiceForm/InvoiceForm';
import { formatDate } from '@/lib/dates';
import { isGame } from '@/lib/gameResult';
import gameDayService from '@/services/GameDay';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Invoice Check' };

interface InvoicePageProps {
    searchParams: Promise<{ year?: string; month?: string }>;
}

const InvoicePage = async ({ searchParams }: InvoicePageProps) => {
    const params = await searchParams;

    const now = new Date();
    // Default to next month since the invoice covers the coming month's bookings
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const year = params.year
        ? parseInt(params.year, 10)
        : nextMonth.getFullYear();
    const month = params.month
        ? parseInt(params.month, 10)
        : nextMonth.getMonth() + 1;

    const gameDaysRaw = await gameDayService.getForMonth(year, month);

    // A game day is considered to have a game scheduled if its status isn't
    // NoGame, or if the invitations were sent (mailSent is not null).
    const gameDays = gameDaysRaw.map((gd) => ({
        id: gd.id,
        date: formatDate(gd.date),
        gameScheduled: isGame(gd.status) || gd.mailSent !== null,
        hallCost: gd.hallCost,
    }));

    return (
        <>
            <AutoRefresh channels={[FootyChannel.Games, FootyChannel.Money]} />
            <InvoiceForm
                year={year}
                month={month}
                gameDays={gameDays}
                onUpdateGameDays={updateInvoiceGameDays}
                onRecordHallHire={recordHallHire}
            />
        </>
    );
};

export default InvoicePage;
