import gameDayService from "services/GameDay";

interface PageProps { }

const Page: React.FC<PageProps> = async () => {
    return (
        <>
            <p>{await gameDayService.getGamesPlayed(0)} games played to date.</p>
            <p>{await gameDayService.getGamesRemaining(0)} future games confirmed.</p>
        </>
    );
};

export default Page;
