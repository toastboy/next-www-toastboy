"use client";

import { Loader } from "@mantine/core";
import GameDaySummary from "components/GameDaySummary/GameDaySummary";
import { useGameDay } from "lib/swr";
import { notFound } from "next/navigation";
import { use } from "react";

interface Props {
    params: Promise<{ id: string }>,
}

const Page: React.FC<Props> = (props) => {
    const { id } = use(props.params);
    const gameDayId = parseInt(id);
    const { data: gameDay, error, isLoading } = useGameDay(gameDayId);

    if (isNaN(gameDayId)) return notFound();
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !gameDay) return <div>failed to load</div>;

    return (
        <GameDaySummary gameDay={gameDay} />
    );
};

export default Page;
