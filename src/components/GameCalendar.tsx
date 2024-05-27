'use client';

import { useEffect, useState } from 'react';
import { Calendar, DatePickerProps } from '@mantine/dates';
import { GameDay } from '@prisma/client';
import { Indicator } from '@mantine/core';
import Link from 'next/link';

interface GameCalendarProps {
    date: Date;
}

const GameCalendar: React.FC<GameCalendarProps> = ({ date }) => {
    const [gameDays, setGameDays] = useState<GameDay[]>([]);

    const getGameDay = (date: Date): GameDay | null => {
        // TODO: This game day date logic works but it seems clunky
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0, 0, 0);
        const dateString = localDate.toISOString();
        const filteredGameDays = gameDays.filter(gameDay => new Date(gameDay.date).toISOString() === dateString);

        return filteredGameDays.length > 0 ? filteredGameDays[0] : null;
    };

    useEffect(() => {
        fetch('/api/footy/gameday')
            .then(response => response.json())
            .then(data => {
                setGameDays(data);
            })
            .catch(error => console.error('Failed to fetch GameDays:', error));
    }, []);

    const renderDay = (date: Date) => {
        const gameDay = getGameDay(date);

        if (gameDay) {
            return (
                <Link href={`/footy/game/${gameDay.id}`}>
                    <Indicator size={6} color={gameDay.game ? "green" : "red"} offset={-5}>
                        <div>{date.getDate()}</div>
                    </Indicator>
                </Link>
            );
        }
    };

    const getDayProps: DatePickerProps['getDayProps'] = (date) => {
        const gameDay = getGameDay(date);

        return {
            disabled: gameDay ? false : true,
        };
    };

    return <Calendar
        defaultDate={date}
        renderDay={renderDay}
        getDayProps={getDayProps}
    />;
};

export default GameCalendar;
