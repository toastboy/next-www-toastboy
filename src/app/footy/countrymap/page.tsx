import { CountryMapShell } from '@/components/CountryMapShell/CountryMapShell';
import countrySupporterService from '@/services/CountrySupporter';

export const metadata = { title: 'Country Map' };

/**
 * Server page that fetches all country-supporter relationships (with
 * country and player data) and passes them to {@link CountryMapShell} for
 * rendering.
 */
const CountryMapPage = async () => {
    const countries =
        await countrySupporterService.getAllWithCountryAndPlayer();

    return <CountryMapShell countries={countries} />;
};

export default CountryMapPage;
