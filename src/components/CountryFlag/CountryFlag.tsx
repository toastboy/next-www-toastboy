import { Image } from '@mantine/core';
import countryService from 'services/Country';

export interface Props {
    countryISOCode: string,
}

const CountryFlag: React.FC<Props> = async ({ countryISOCode }) => {
    const country = await countryService.get(countryISOCode);

    if (!country) return <></>;

    return (
        <Image
            w="100%"
            h="100%"
            src={`/api/footy/country/${country.isoCode.toLowerCase()}/flag`}
            alt={country.name}
            title={country.name}
        />
    );
};

export default CountryFlag;
