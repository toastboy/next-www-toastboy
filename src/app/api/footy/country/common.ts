import countryService from 'services/Country';

export async function getCountry(isoCode: string) {
    return await countryService.get(isoCode);
}
