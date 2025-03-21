import { Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";

dayjs.extend(relativeTime);

// Accepts a Date object, ISO string, or timestamp

export interface Props {
    date: Date | string | number;
}

export const RelativeTime: React.FC<Props> = ({ date }) => {
    const formattedDate = dayjs(date);
    const relativeTime = formattedDate.fromNow();

    return (
        <Tooltip label={formattedDate.format("YYYY-MM-DD HH:mm:ss")}>
            <Text>{relativeTime}</Text>
        </Tooltip>
    );
};
