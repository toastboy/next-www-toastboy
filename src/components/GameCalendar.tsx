'use client';

import { useEffect, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { GameDay } from '@prisma/client';
import { Indicator } from '@mantine/core';

function handleChange(value: Date | null) {
    console.log(value);
}

export default function GameCalendar({
    date,
}: {
    date: Date,
}) {
    const [gameDays, setGameDays] = useState<GameDay[]>([]);

    useEffect(() => {
        fetch('/api/footy/gamedays')
            .then(response => response.json())
            .then(data => {
                setGameDays(data);
            })
            .catch(error => console.error('Failed to fetch GameDays:', error));
    }, []);

    const renderDay = (date: Date) => {
        // TODO: This game day date logic works but it seems clunky
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0, 0, 0);
        const dateString = localDate.toISOString();
        const filteredGameDays = gameDays.filter(gameDay => new Date(gameDay.date).toISOString() === dateString);
        const gameDay = filteredGameDays.length > 0 ? filteredGameDays[0] : null;

        if (gameDay) {
            return (
                <Indicator size={6} color={gameDay.game ? "green" : "red"} offset={-5}>
                    <div>{date.getDate()}</div>
                </Indicator>
            );
        }
    };

    return <DatePicker
        defaultDate={date}
        onChange={handleChange}
        renderDay={renderDay}
    />;
}
