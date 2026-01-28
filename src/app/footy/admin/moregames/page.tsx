import { createMoreGameDays } from '@/actions/createMoreGameDays';
import { MoreGamesForm } from '@/components/MoreGamesForm/MoreGamesForm';
import gameDayService from '@/services/GameDay';

const toIsoDate = (date: Date) => date.toISOString().split('T')[0];

const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const normalizeGameDayTime = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0, 0, 0);

const getBookingYearEnd = (date: Date) => {
    const year = date.getFullYear();
    const isAfterJuly = date.getMonth() >= 7;
    const endYear = isAfterJuly ? year + 1 : year;
    return new Date(endYear, 6, 31, 18, 0, 0, 0);
};

const getNextTuesday = (from: Date) => {
    const day = from.getDay();
    const daysUntilTuesday = (2 - day + 7) % 7;
    const candidate = addDays(from, daysUntilTuesday);
    return candidate <= from ? addDays(candidate, 7) : candidate;
};

const buildRows = (startDate: Date) => {
    const endDate = getBookingYearEnd(startDate);
    const rows = [];

    for (let date = new Date(startDate); date <= endDate; date = addDays(date, 7)) {
        rows.push({
            date: toIsoDate(date),
            game: true,
            comment: '',
        });
    }

    return rows;
};

type PageProps = object;

const Page: React.FC<PageProps> = async () => {
    const gameDays = await gameDayService.getAll();
    const lastGameDay = gameDays.reduce<Date | null>((latest, gameDay) => {
        if (!latest) return gameDay.date;
        return gameDay.date > latest ? gameDay.date : latest;
    }, null);

    const startDate = lastGameDay
        ? addDays(normalizeGameDayTime(lastGameDay), 7)
        : normalizeGameDayTime(getNextTuesday(new Date()));
    const rows = buildRows(startDate);

    return (
        <MoreGamesForm
            rows={rows}
            onCreateMoreGameDays={createMoreGameDays}
        />
    );
};

export default Page;
