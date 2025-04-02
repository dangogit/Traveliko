import { Country } from '@/types/travel';

/**
 * Get the Hebrew name of a country
 * @param country The country object
 * @returns The Hebrew name of the country, or a fallback if not available
 */
export const getCountryNameHebrew = (country: Country | null | undefined): string => {
  if (!country) return 'לא ידוע';
  return country.nameHe || country.nameEn || 'לא ידוע';
}; 