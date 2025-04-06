import { Recommendation } from '@/types/travel';

// Placeholder mock data for accommodations
// TODO: Replace placeholder details with real data
// TODO: Ensure corresponding locations exist in mocks/locations.ts

export const accommodations: Recommendation[] = [
  // Rome, Italy (Country ID: italy, Location ID: rome)
  {
    id: 'rome-hotel-1',
    locationId: 'rome', 
    countryId: 'italy', // Added countryId
    type: 'hotel',
    nameHe: 'מלון פלטינו פאלאס (רומא)',
    nameEn: 'Hotel Platino Palace (Rome)',
    description: 'מלון קלאסי במיקום מרכזי ליד תחנת טרמיני, מציע חדרים נוחים ושירות אדיב.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600',
    price: { amount: 120, currency: 'EUR' },
    rating: 4.2,
    address: 'Via Principe Amedeo, 94, 00185 Roma RM, Italy',
    website: 'https://www.booking.com/',
    suitableFor: ['couple', 'business'],
    bestSeason: ['spring', 'fall']
  },
  {
    id: 'rome-hostel-1',
    locationId: 'rome', 
    countryId: 'italy', // Added countryId
    type: 'hostel',
    nameHe: 'הילו הוסטל (רומא)',
    nameEn: 'The Hilo Hostel (Rome)',
    description: 'הוסטל מודרני וחברתי עם אווירה צעירה, מציע חדרים משותפים ופרטיים, בר ופעילויות.',
    image: 'https://images.unsplash.com/photo-1582530563756-69b1a79fcd15?q=80&w=600',
    price: { amount: 35, currency: 'EUR' },
    rating: 4.6,
    address: 'Via Marghera, 49, 00185 Roma RM, Italy',
    website: 'https://www.booking.com/',
    suitableFor: ['solo', 'friends'],
    bestSeason: ['spring', 'summer', 'fall']
  },

  // Paris, France (Country ID: france, Location ID: paris)
  {
    id: 'paris-hotel-1',
    locationId: 'paris', 
    countryId: 'france', // Added countryId
    type: 'hotel',
    nameHe: 'מלון סן ז\'רמן (פריז)',
    nameEn: 'Hôtel Saint-Germain (Paris)',
    description: 'מלון בוטיק מקסים בלב רובע סן ז\'רמן דה פרה, קרוב לאטרקציות רבות.',
    image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=600',
    price: { amount: 180, currency: 'EUR' },
    rating: 4.5,
    address: '88 Rue du Bac, 75007 Paris, France',
    website: 'https://www.booking.com/',
    suitableFor: ['couple', 'family'],
    bestSeason: ['spring', 'summer', 'fall']
  },
  {
    id: 'paris-hostel-1',
    locationId: 'paris', 
    countryId: 'france', // Added countryId
    type: 'hostel',
    nameHe: 'ג\'נרטור הוסטל (פריז)',
    nameEn: 'Generator Hostel (Paris)',
    description: 'הוסטל גדול ומעוצב ליד קאנאל סן מרטן, מציע מגוון חדרים, רופטופ בר ואווירה תוססת.',
    image: 'https://images.unsplash.com/photo-1590411612725-dfa198807187?q=80&w=600',
    price: { amount: 40, currency: 'EUR' },
    rating: 4.3,
    address: '9-11 Pl. du Colonel Fabien, 75010 Paris, France',
    website: 'https://www.booking.com/',
    suitableFor: ['solo', 'friends'],
    bestSeason: ['spring', 'summer', 'fall']
  },

  // Bangkok, Thailand (Country ID: thailand, Location ID: bangkok)
  {
    id: 'bangkok-hotel-1',
    locationId: 'bangkok', 
    countryId: 'thailand', // Added countryId
    type: 'hotel',
    nameHe: 'מלון מנדרין אוריינטל (בנגקוק)',
    nameEn: 'Mandarin Oriental (Bangkok)',
    description: 'מלון יוקרה אייקוני על גדות נהר צ\'או פראיה, מציע שירות ברמה עולמית ונופים מרהיבים.',
    image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?q=80&w=600',
    price: { amount: 300, currency: 'USD' }, // Approx THB equivalent
    rating: 4.9,
    address: '48 Oriental Ave, Khwaeng Bang Rak, Khet Bang Rak, Bangkok 10500, Thailand',
    website: 'https://www.booking.com/',
    suitableFor: ['couple', 'business', 'luxury'], // Added luxury category
    bestSeason: ['winter']
  },
  {
    id: 'bangkok-hostel-1',
    locationId: 'bangkok', 
    countryId: 'thailand', // Added countryId
    type: 'hostel',
    nameHe: 'וונס בנגקוק הוסטל (בנגקוק)',
    nameEn: 'Once Again Hostel (Bangkok)',
    description: 'הוסטל מקסים באזור העיר העתיקה, מציע חדרים נקיים, אווירה שקטה וצוות ידידותי.',
    image: 'https://images.unsplash.com/photo-1584132905291-855c9822f739?q=80&w=600',
    price: { amount: 20, currency: 'USD' }, // Approx THB equivalent
    rating: 4.7,
    address: '22 Soi Samran Rat, Mahachai Road, Phra Borom Maha Ratchawang, Phra Nakhon, Bangkok 10200, Thailand',
    website: 'https://www.booking.com/',
    suitableFor: ['solo', 'couple', 'friends'],
    bestSeason: ['winter']
  },

  // New York City, USA (Country ID: usa, Location ID: nyc)
  {
    id: 'nyc-hotel-1',
    locationId: 'nyc', 
    countryId: 'usa', // Added countryId
    type: 'hotel',
    nameHe: 'מלון ארלו סוהו (ניו יורק)',
    nameEn: 'Arlo SoHo (New York)',
    description: 'מלון טרנדי בסוהו עם חדרים קומפקטיים אך מעוצבים, רופטופ בר וחללים משותפים נעימים.',
    image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=600',
    price: { amount: 250, currency: 'USD' },
    rating: 4.4,
    address: '231 Hudson St, New York, NY 10013, USA',
    website: 'https://www.booking.com/',
    suitableFor: ['couple', 'friends', 'business'],
    bestSeason: ['spring', 'summer', 'fall']
  },
  {
    id: 'nyc-hostel-1',
    locationId: 'nyc', 
    countryId: 'usa', // Added countryId
    type: 'hostel',
    nameHe: 'הוסטל פריהנד (ניו יורק)',
    nameEn: 'Freehand New York',
    description: 'הוסטל מעוצב באזור פלטאיירון, מציע חדרים משותפים ופרטיים, מסעדות וברים פופולריים.',
    image: 'https://images.unsplash.com/photo-1568495160451-7255e0010835?q=80&w=600',
    price: { amount: 70, currency: 'USD' },
    rating: 4.1,
    address: '23 Lexington Ave, New York, NY 10010, USA',
    website: 'https://www.booking.com/',
    suitableFor: ['solo', 'friends', 'couple'],
    bestSeason: ['spring', 'summer', 'fall']
  }
]; 