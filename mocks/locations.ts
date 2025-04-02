import { Location } from '@/types/travel';

export const locations: Location[] = [
  // Italy
  {
    id: 'rome',
    countryId: 'italy',
    nameHe: 'רומא',
    nameEn: 'Rome',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
    description: 'בירת איטליה, עיר עתיקה עם היסטוריה עשירה, אתרים ארכיאולוגיים, כנסיות, מוזיאונים ואוכל מצוין.',
    recommendedDuration: 3
  },
  {
    id: 'florence',
    countryId: 'italy',
    nameHe: 'פירנצה',
    nameEn: 'Florence',
    image: 'https://images.unsplash.com/photo-1543429257-3eb0b65d9c58',
    description: 'מרכז האמנות והרנסנס של איטליה, עם מוזיאונים, כנסיות, ארמונות ואווירה קסומה.',
    recommendedDuration: 2
  },
  {
    id: 'venice',
    countryId: 'italy',
    nameHe: 'ונציה',
    nameEn: 'Venice',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0',
    description: 'עיר התעלות המפורסמת, עם גונדולות, כיכרות, כנסיות ואווירה רומנטית ייחודית.',
    recommendedDuration: 2
  },

  // Spain
  {
    id: 'barcelona',
    countryId: 'spain',
    nameHe: 'ברצלונה',
    nameEn: 'Barcelona',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    description: 'עיר תוססת עם אדריכלות ייחודית של גאודי, חופים, אוכל מצוין ואווירה תוססת.',
    recommendedDuration: 3
  },
  {
    id: 'madrid',
    countryId: 'spain',
    nameHe: 'מדריד',
    nameEn: 'Madrid',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4',
    description: 'בירת ספרד, עיר תוססת עם מוזיאונים מעולים, פארקים, כיכרות ואוכל מצוין.',
    recommendedDuration: 3
  },
  {
    id: 'seville',
    countryId: 'spain',
    nameHe: 'סביליה',
    nameEn: 'Seville',
    image: 'https://images.unsplash.com/photo-1559636425-c7d44270a6b2',
    description: 'עיר אנדלוסית עם ארכיטקטורה מרשימה, מסורת פלמנקו, אווירה חמה ואוכל מצוין.',
    recommendedDuration: 2
  },

  // France
  {
    id: 'paris',
    countryId: 'france',
    nameHe: 'פריז',
    nameEn: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: 'עיר האורות, עם מגדל אייפל, מוזיאון הלובר, שאנז אליזה, מסעדות מעולות ואווירה רומנטית.',
    recommendedDuration: 4
  },
  {
    id: 'nice',
    countryId: 'france',
    nameHe: 'ניס',
    nameEn: 'Nice',
    image: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc',
    description: 'עיר יפהפייה בריביירה הצרפתית, עם חופים, טיילת, שווקים צבעוניים ואוכל ים תיכוני מצוין.',
    recommendedDuration: 2
  },

  // Japan
  {
    id: 'tokyo',
    countryId: 'japan',
    nameHe: 'טוקיו',
    nameEn: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    description: 'בירת יפן, מטרופולין ענק עם טכנולוגיה מתקדמת, קניות, אוכל מעולה, מקדשים ותרבות ייחודית.',
    recommendedDuration: 4
  },
  {
    id: 'kyoto',
    countryId: 'japan',
    nameHe: 'קיוטו',
    nameEn: 'Kyoto',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    description: 'העיר ההיסטורית של יפן, עם מקדשים, גנים, בתי תה מסורתיים ואווירה יפנית אותנטית.',
    recommendedDuration: 3
  },

  // Thailand
  {
    id: 'bangkok',
    countryId: 'thailand',
    nameHe: 'בנגקוק',
    nameEn: 'Bangkok',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365',
    description: 'בירת תאילנד, עיר תוססת עם מקדשים, שווקים, אוכל רחוב מצוין וחיי לילה תוססים.',
    recommendedDuration: 3
  },
  {
    id: 'phuket',
    countryId: 'thailand',
    nameHe: 'פוקט',
    nameEn: 'Phuket',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5',
    description: 'אי טרופי עם חופים מרהיבים, מים צלולים, ספורט ימי, מסעדות ומלונות מפנקים.',
    recommendedDuration: 4
  },

  // USA
  {
    id: 'new_york',
    countryId: 'usa',
    nameHe: 'ניו יורק',
    nameEn: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
    description: 'העיר שאינה ישנה לעולם, עם גורדי שחקים, מוזיאונים, תיאטראות, קניות ואוכל מכל העולם.',
    recommendedDuration: 5
  },
  {
    id: 'los_angeles',
    countryId: 'usa',
    nameHe: 'לוס אנג\'לס',
    nameEn: 'Los Angeles',
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0',
    description: 'עיר הכוכבים, עם הוליווד, חופים, פארקי שעשועים, מוזיאונים ואווירה קליפורנית.',
    recommendedDuration: 4
  },

  // Brazil
  {
    id: 'rio_de_janeiro',
    countryId: 'brazil',
    nameHe: 'ריו דה ז\'נרו',
    nameEn: 'Rio de Janeiro',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325',
    description: 'עיר מרהיבה עם חופים, הר הסוכר, פסל ישו, סמבה וקרנבל מפורסם.',
    recommendedDuration: 4
  },

  // Israel
  {
    id: 'jerusalem',
    countryId: 'israel',
    nameHe: 'ירושלים',
    nameEn: 'Jerusalem',
    image: 'https://images.unsplash.com/photo-1529106575427-91b84b7e7189',
    description: 'עיר הקודש לשלוש הדתות, עם העיר העתיקה, הכותל המערבי, כיפת הסלע וכנסיית הקבר.',
    recommendedDuration: 3
  },
  {
    id: 'tel_aviv',
    countryId: 'israel',
    nameHe: 'תל אביב',
    nameEn: 'Tel Aviv',
    image: 'https://images.unsplash.com/photo-1544971587-b842c27f8e32',
    description: 'עיר החוף התוססת של ישראל, עם חופים, מסעדות, חיי לילה, אדריכלות באוהאוס ואווירה צעירה.',
    recommendedDuration: 3
  }
];