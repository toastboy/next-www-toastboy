import gameDayService from 'services/GameDay';

export default async function GameYears() {
    const distinctYears = await gameDayService.getAllYears();

    if (!distinctYears) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            {distinctYears.map((year, index) => (
                <p key={index} className="text-gray-700 text-base">{year}</p>
            ))}
        </div>
    );
}
