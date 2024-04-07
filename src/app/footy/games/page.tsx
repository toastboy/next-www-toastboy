import gameDayService from "services/GameDay";

export default async function Page() {
    return (
        <div>
            <p>{await gameDayService.getGamesPlayed(0)} games played to date.</p>
            <p>{await gameDayService.getGamesRemaining(0)} future games confirmed.</p>
        </div>
    );
}
