import { Airline } from '@/types/travel';

export const airlines: Airline[] = [
  {
    id: 'el_al',
    nameHe: 'אל על',
    nameEn: 'El Al',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת התעופה הלאומית של ישראל, מפעילה טיסות לאירופה, צפון אמריקה, אפריקה ואסיה.',
    rating: 3.8,
    alliance: 'אין',
    website: 'https://www.elal.com',
    servesCountries: ['israel', 'usa', 'france', 'italy', 'spain', 'thailand', 'japan']
  },
  {
    id: 'lufthansa',
    nameHe: 'לופטהנזה',
    nameEn: 'Lufthansa',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת התעופה הלאומית של גרמניה, אחת מחברות התעופה הגדולות באירופה.',
    rating: 4.2,
    alliance: 'Star Alliance',
    website: 'https://www.lufthansa.com',
    servesCountries: ['israel', 'usa', 'france', 'italy', 'spain', 'japan', 'thailand']
  },
  {
    id: 'emirates',
    nameHe: 'אמירייטס',
    nameEn: 'Emirates',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת תעופה מדובאי, ידועה בשירות מעולה וצי מטוסים מודרני.',
    rating: 4.5,
    alliance: 'אין',
    website: 'https://www.emirates.com',
    servesCountries: ['israel', 'usa', 'france', 'italy', 'spain', 'japan', 'thailand']
  },
  {
    id: 'delta',
    nameHe: 'דלתא',
    nameEn: 'Delta Airlines',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת תעופה אמריקאית גדולה, מפעילה טיסות לכל העולם.',
    rating: 4.0,
    alliance: 'SkyTeam',
    website: 'https://www.delta.com',
    servesCountries: ['israel', 'usa', 'france', 'italy', 'spain', 'japan']
  },
  {
    id: 'air_france',
    nameHe: 'אייר פראנס',
    nameEn: 'Air France',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת התעופה הלאומית של צרפת, מפעילה טיסות לכל העולם.',
    rating: 4.1,
    alliance: 'SkyTeam',
    website: 'https://www.airfrance.com',
    servesCountries: ['israel', 'usa', 'france', 'italy', 'spain', 'japan', 'thailand']
  },
  {
    id: 'british_airways',
    nameHe: 'בריטיש איירווייז',
    nameEn: 'British Airways',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת התעופה הלאומית של בריטניה, מפעילה טיסות לכל העולם.',
    rating: 4.0,
    alliance: 'Oneworld',
    website: 'https://www.britishairways.com',
    servesCountries: ['israel', 'usa', 'france', 'italy', 'spain', 'japan', 'thailand']
  },
  {
    id: 'turkish_airlines',
    nameHe: 'טורקיש איירליינס',
    nameEn: 'Turkish Airlines',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת התעופה הלאומית של טורקיה, מפעילה טיסות ליותר מדינות מכל חברת תעופה אחרת.',
    rating: 4.3,
    alliance: 'Star Alliance',
    website: 'https://www.turkishairlines.com',
    servesCountries: ['israel', 'usa', 'france', 'italy', 'spain', 'japan', 'thailand']
  },
  {
    id: 'easyjet',
    nameHe: 'איזי ג\'ט',
    nameEn: 'EasyJet',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת תעופה לואו-קוסט בריטית, מפעילה טיסות באירופה ואגן הים התיכון.',
    rating: 3.7,
    alliance: 'אין',
    website: 'https://www.easyjet.com',
    servesCountries: ['israel', 'france', 'italy', 'spain']
  },
  {
    id: 'ryanair',
    nameHe: 'ריינאייר',
    nameEn: 'Ryanair',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת תעופה לואו-קוסט אירית, הגדולה באירופה במספר הנוסעים.',
    rating: 3.5,
    alliance: 'אין',
    website: 'https://www.ryanair.com',
    servesCountries: ['israel', 'france', 'italy', 'spain']
  },
  {
    id: 'thai_airways',
    nameHe: 'תאי איירווייז',
    nameEn: 'Thai Airways',
    logo: 'https://images.unsplash.com/photo-1540339832862-474599807836',
    description: 'חברת התעופה הלאומית של תאילנד, ידועה בשירות ואוכל מעולים.',
    rating: 4.2,
    alliance: 'Star Alliance',
    website: 'https://www.thaiairways.com',
    servesCountries: ['israel', 'usa', 'france', 'italy', 'japan', 'thailand']
  }
];