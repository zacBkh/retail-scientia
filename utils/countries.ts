import worldCountries from '@/constants/countries-data'

export const getCountryDetails = (iso3: string) => {
  return worldCountries.find((cty) => cty.iso3 === iso3)
}
