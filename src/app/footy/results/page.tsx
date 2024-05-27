import GameCalendar from "components/GameCalendar";

interface PageProps { }

const Page: React.FC<PageProps> = () => {
    return (
        <GameCalendar date={new Date()} />
    );
};

export default Page;
