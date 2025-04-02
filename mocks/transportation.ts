import { Transportation } from '@/types/travel';

export const transportation: Transportation[] = [
  // Flights
  {
    id: 'flight_italy_france',
    type: 'flight',
    fromCountryId: 'italy',
    toCountryId: 'france',
    nameHe: 'טיסה מאיטליה לצרפת',
    nameEn: 'Flight from Italy to France',
    description: 'טיסות ישירות בין רומא/מילאנו לפריז, עם מגוון חברות תעופה.',
    duration: '1.5-2 שעות',
    priceRange: '€80-200',
    frequency: 'מספר טיסות ביום',
    website: 'https://www.skyscanner.com',
    tips: 'כדאי להזמין כ-3 חודשים מראש לקבלת המחירים הטובים ביותר.'
  },
  {
    id: 'flight_france_spain',
    type: 'flight',
    fromCountryId: 'france',
    toCountryId: 'spain',
    nameHe: 'טיסה מצרפת לספרד',
    nameEn: 'Flight from France to Spain',
    description: 'טיסות ישירות בין פריז לברצלונה/מדריד, עם מגוון חברות תעופה.',
    duration: '1.5-2 שעות',
    priceRange: '€70-180',
    frequency: 'מספר טיסות ביום',
    website: 'https://www.skyscanner.com',
    tips: 'חברות לואו-קוסט כמו Ryanair ו-Vueling מציעות מחירים נמוכים במיוחד.'
  },
  {
    id: 'flight_israel_italy',
    type: 'flight',
    fromCountryId: 'israel',
    toCountryId: 'italy',
    nameHe: 'טיסה מישראל לאיטליה',
    nameEn: 'Flight from Israel to Italy',
    description: 'טיסות ישירות מתל אביב לרומא, מילאנו וערים נוספות באיטליה.',
    duration: '3.5-4 שעות',
    priceRange: '₪600-1200',
    frequency: 'מספר טיסות ביום',
    website: 'https://www.elal.com',
    tips: 'אל על, איזי ג\'ט ורייאנאייר מפעילות טיסות ישירות. כדאי להשוות מחירים.'
  },
  {
    id: 'flight_israel_thailand',
    type: 'flight',
    fromCountryId: 'israel',
    toCountryId: 'thailand',
    nameHe: 'טיסה מישראל לתאילנד',
    nameEn: 'Flight from Israel to Thailand',
    description: 'טיסות ישירות מתל אביב לבנגקוק.',
    duration: '10-11 שעות',
    priceRange: '₪1800-3500',
    frequency: 'מספר טיסות בשבוע',
    website: 'https://www.elal.com',
    tips: 'אל על וארקיע מפעילות טיסות ישירות. בעונת השיא המחירים עולים משמעותית.'
  },
  {
    id: 'flight_israel_usa',
    type: 'flight',
    fromCountryId: 'israel',
    toCountryId: 'usa',
    nameHe: 'טיסה מישראל לארה"ב',
    nameEn: 'Flight from Israel to USA',
    description: 'טיסות ישירות מתל אביב לניו יורק, לוס אנג\'לס ומיאמי.',
    duration: '12-14 שעות',
    priceRange: '₪2500-5000',
    frequency: 'מספר טיסות ביום',
    website: 'https://www.elal.com',
    tips: 'אל על, דלתא ויונייטד מפעילות טיסות ישירות. כדאי להזמין לפחות 3 חודשים מראש.'
  },

  // Trains
  {
    id: 'train_france_internal',
    type: 'train',
    fromCountryId: 'france',
    toCountryId: 'france',
    nameHe: 'רכבות בצרפת',
    nameEn: 'Trains in France',
    description: 'רשת רכבות מהירה (TGV) המחברת בין הערים הגדולות בצרפת.',
    duration: 'משתנה לפי יעד',
    priceRange: '€20-120',
    frequency: 'תדירות גבוהה',
    website: 'https://www.sncf.com',
    tips: 'כרטיסי רכבת זולים יותר כשמזמינים מראש. שקלו לרכוש כרטיס Eurail אם מתכננים נסיעות רבות.'
  },
  {
    id: 'train_italy_internal',
    type: 'train',
    fromCountryId: 'italy',
    toCountryId: 'italy',
    nameHe: 'רכבות באיטליה',
    nameEn: 'Trains in Italy',
    description: 'רשת רכבות מהירה (Frecciarossa) המחברת בין הערים הגדולות באיטליה.',
    duration: 'משתנה לפי יעד',
    priceRange: '€20-100',
    frequency: 'תדירות גבוהה',
    website: 'https://www.trenitalia.com',
    tips: 'הרכבות המהירות נוחות מאוד ומהוות אלטרנטיבה מצוינת לטיסות פנים.'
  },
  {
    id: 'train_spain_internal',
    type: 'train',
    fromCountryId: 'spain',
    toCountryId: 'spain',
    nameHe: 'רכבות בספרד',
    nameEn: 'Trains in Spain',
    description: 'רשת רכבות מהירה (AVE) המחברת בין הערים הגדולות בספרד.',
    duration: 'משתנה לפי יעד',
    priceRange: '€30-120',
    frequency: 'תדירות גבוהה',
    website: 'https://www.renfe.com',
    tips: 'רכבות ה-AVE מהירות מאוד ונוחות. הזמנה מראש חוסכת כסף.'
  },

  // Buses
  {
    id: 'bus_europe',
    type: 'bus',
    fromCountryId: 'france',
    toCountryId: 'italy',
    nameHe: 'אוטובוסים באירופה',
    nameEn: 'Buses in Europe',
    description: 'חברות אוטובוסים כמו FlixBus מציעות נסיעות בין ערים ומדינות באירופה במחירים נוחים.',
    duration: 'משתנה לפי יעד',
    priceRange: '€10-50',
    frequency: 'תדירות גבוהה',
    website: 'https://www.flixbus.com',
    tips: 'האוטובוסים זולים יותר מרכבות וטיסות, אך לוקחים יותר זמן. מתאים למטיילים בתקציב מוגבל.'
  },
  {
    id: 'bus_thailand',
    type: 'bus',
    fromCountryId: 'thailand',
    toCountryId: 'thailand',
    nameHe: 'אוטובוסים בתאילנד',
    nameEn: 'Buses in Thailand',
    description: 'רשת אוטובוסים נרחבת המחברת בין הערים והאזורים השונים בתאילנד.',
    duration: 'משתנה לפי יעד',
    priceRange: '100-500 באט',
    frequency: 'תדירות גבוהה',
    website: 'https://12go.asia',
    tips: 'אוטובוסי לילה חוסכים זמן ועלות לינה. יש לבחור בחברות מוכרות לנסיעות בטוחות.'
  },

  // Ferries
  {
    id: 'ferry_greece_islands',
    type: 'ferry',
    fromCountryId: 'greece',
    toCountryId: 'greece',
    nameHe: 'מעבורות ליוון',
    nameEn: 'Ferries to Greek Islands',
    description: 'מעבורות מאתונה ונמלים אחרים לאיים היווניים.',
    duration: '1-8 שעות',
    priceRange: '€20-60',
    frequency: 'משתנה לפי עונה ויעד',
    website: 'https://www.ferryhopper.com',
    tips: 'בעונת הקיץ כדאי להזמין מראש. יש מעבורות מהירות ואיטיות במחירים שונים.'
  },
  {
    id: 'ferry_thailand_islands',
    type: 'ferry',
    fromCountryId: 'thailand',
    toCountryId: 'thailand',
    nameHe: 'מעבורות לאיי תאילנד',
    nameEn: 'Ferries to Thai Islands',
    description: 'מעבורות מהיבשת לאיים הפופולריים כמו קו פי פי, קו סמוי וקו טאו.',
    duration: '1-3 שעות',
    priceRange: '300-1000 באט',
    frequency: 'מספר פעמים ביום',
    website: 'https://12go.asia',
    tips: 'בעונת הגשמים ייתכנו ביטולים. כדאי לבדוק את מזג האוויר לפני הנסיעה.'
  }
];