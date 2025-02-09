import gameDayService from "services/GameDay"; // TODO: use API, not service directly

type PageProps = object

const Page: React.FC<PageProps> = async () => {
    return (
        <>
            <p>{await gameDayService.getGamesPlayed(0)} games played to date.</p>
            <p>{await gameDayService.getGamesRemaining(0)} future games confirmed.</p>
        </>
    );
};

export default Page;
