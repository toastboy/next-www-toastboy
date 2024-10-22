import GameCalendar from "components/GameCalendar";

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <GameCalendar date={new Date()} />
    );
};

export default Page;
