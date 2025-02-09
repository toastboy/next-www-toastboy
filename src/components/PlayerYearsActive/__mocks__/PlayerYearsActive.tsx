const MockPlayerYearsActive = ({ onYearChange }: { onYearChange: (year: number) => void }) => (
    <button type="button" onClick={() => onYearChange(NaN)}>Change Year to NaN</button>
);
MockPlayerYearsActive.displayName = 'MockPlayerYearsActive';
export default MockPlayerYearsActive;
