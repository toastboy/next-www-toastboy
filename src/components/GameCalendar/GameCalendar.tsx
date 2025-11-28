'use client';

import { Anchor, Indicator, Text } from '@mantine/core';
import { Calendar, DatePickerProps } from '@mantine/dates';
import { GameDaySchema, GameDayType } from 'prisma/generated/schemas/models/GameDay.schema';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const GameDayResponseSchema = GameDaySchema.extend({
    date: z.coerce.date(),
    mailSent: z.coerce.date().nullish(),
});

interface GameCalendarProps {
    date: Date;
}

const GameCalendar: React.FC<GameCalendarProps> = ({ date }) => {
    const [gameDays, setGameDays] = useState<GameDayType[]>([]);

    const getGameDay = (date: Date): GameDayType | null => {
        if (!gameDays || gameDays.length === 0) return null;
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0, 0, 0);
        const dateString = localDate.toISOString();
        const filteredGameDays = gameDays.filter(gameDay => new Date(gameDay.date).toISOString() === dateString);

        return filteredGameDays.length > 0 ? filteredGameDays[0] : null;
    };

    useEffect(() => {
        fetch('/api/footy/gameday')
            .then(response => response.json())
            .then(data => {
                const parsedGameDays = GameDayResponseSchema.array().parse(data);
                return setGameDays(parsedGameDays);
            })
            .catch(error => {
                console.error('Failed to fetch GameDays:', error);
                throw error;
            });
    }, []);

    const renderDay = (date: string) => {
        const gameDate = new Date(date);
        const gameDay = getGameDay(gameDate);

        if (gameDay) {
            return (
                <Anchor href={`/footy/game/${gameDay.id}`}>
                    <Indicator
                        size={6}
                        color={gameDay.game ? "green" : "red"}
                        data-testid={`game-day-indicator-${gameDay.game ? "true" : "false"}`}
                        offset={-5}
                    >
                        <Text>{gameDate.getDate()}</Text>
                    </Indicator>
                </Anchor>
            );
        }
    };

    const getDayProps: DatePickerProps['getDayProps'] = (date) => {
        const gameDay = getGameDay(new Date(date));

        return {
            disabled: gameDay ? false : true,
        };
    };

    return <Calendar
        defaultDate={date}
        numberOfColumns={3}
        renderDay={renderDay}
        getDayProps={getDayProps}
    />;
};

export default GameCalendar;
