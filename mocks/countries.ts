import { Country } from '@/types/travel';

export const countries: Country[] = [
  // Europe
  {
    id: 'italy',
    regionId: 'europe',
    nameHe: 'איטליה',
    nameEn: 'Italy',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
    description: 'ארץ הפיצה, הפסטה והאמנות. איטליה מציעה שילוב מושלם של היסטוריה, תרבות, אוכל ונופים.',
    currency: 'אירו (EUR)',
    language: 'איטלקית',
    timeZone: 'GMT+1',
    bestTimeToVisit: 'אפריל-יוני, ספטמבר-אוקטובר',
    recommendedApps: [
      {
        id: 'trenitalia',
        name: 'Trenitalia',
        category: 'transportation',
        description: 'אפליקציה רשמית של רכבות איטליה, מאפשרת לרכוש כרטיסים ולבדוק זמני נסיעה.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.trenitalia.com',
        appStoreLink: 'https://apps.apple.com/app/trenitalia/id331050847',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.trenitalia.app'
      },
      {
        id: 'just_eat_italy',
        name: 'Just Eat',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי באיטליה, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.justeat.it',
        appStoreLink: 'https://apps.apple.com/app/just-eat-food-delivery/id566347057',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.justeat.app.it'
      }
    ]
  },
  {
    id: 'spain',
    regionId: 'europe',
    nameHe: 'ספרד',
    nameEn: 'Spain',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325',
    description: 'ארץ הפלמנקו, הטאפאס והשמש. ספרד מציעה חופים מרהיבים, ערים היסטוריות ותרבות עשירה.',
    currency: 'אירו (EUR)',
    language: 'ספרדית',
    timeZone: 'GMT+1',
    bestTimeToVisit: 'אפריל-יוני, ספטמבר-אוקטובר',
    recommendedApps: [
      {
        id: 'renfe',
        name: 'Renfe',
        category: 'transportation',
        description: 'אפליקציה רשמית של רכבות ספרד, מאפשרת לרכוש כרטיסים ולבדוק זמני נסיעה.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.renfe.com',
        appStoreLink: 'https://apps.apple.com/app/renfe/id451937003',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.renfe.app'
      },
      {
        id: 'glovo_spain',
        name: 'Glovo',
        category: 'food',
        description: 'שירות משלוחים פופולרי בספרד, מציע מזון, מצרכים ועוד.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.glovoapp.com',
        appStoreLink: 'https://apps.apple.com/app/glovo-food-delivery-more/id1023238670',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.glovo.android'
      }
    ]
  },
  {
    id: 'france',
    regionId: 'europe',
    nameHe: 'צרפת',
    nameEn: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: 'ארץ היין, הגבינות והאופנה. צרפת מציעה אמנות, תרבות, אוכל משובח ונופים מגוונים.',
    currency: 'אירו (EUR)',
    language: 'צרפתית',
    timeZone: 'GMT+1',
    bestTimeToVisit: 'אפריל-יוני, ספטמבר-אוקטובר',
    recommendedApps: [
      {
        id: 'sncf',
        name: 'SNCF Connect',
        category: 'transportation',
        description: 'אפליקציה רשמית של רכבות צרפת, מאפשרת לרכוש כרטיסים ולבדוק זמני נסיעה.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.sncf-connect.com',
        appStoreLink: 'https://apps.apple.com/app/sncf-connect/id1543497019',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.vsct.vsc.android.oui'
      },
      {
        id: 'deliveroo_france',
        name: 'Deliveroo',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי בצרפת, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.deliveroo.fr',
        appStoreLink: 'https://apps.apple.com/app/deliveroo/id1001501844',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.deliveroo.orderapp'
      }
    ]
  },

  // Asia
  {
    id: 'japan',
    regionId: 'asia',
    nameHe: 'יפן',
    nameEn: 'Japan',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d',
    description: 'שילוב מרתק של מסורת וחדשנות. יפן מציעה טכנולוגיה מתקדמת, מקדשים עתיקים, הרים מושלגים ואוכל מעולה.',
    currency: 'ין יפני (JPY)',
    language: 'יפנית',
    timeZone: 'GMT+9',
    bestTimeToVisit: 'מרץ-מאי, ספטמבר-נובמבר',
    recommendedApps: [
      {
        id: 'japan_transit_planner',
        name: 'Japan Transit Planner',
        category: 'transportation',
        description: 'אפליקציה לתכנון נסיעות בתחבורה ציבורית ביפן, כולל רכבות, מטרו ואוטובוסים.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.navitime.co.jp',
        appStoreLink: 'https://apps.apple.com/app/japan-transit-planner/id686373726',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.navitime.inbound.walk'
      },
      {
        id: 'uber_eats_japan',
        name: 'Uber Eats',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי ביפן, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.ubereats.com/jp',
        appStoreLink: 'https://apps.apple.com/app/uber-eats-food-delivery/id1058959277',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.ubercab.eats'
      }
    ]
  },
  {
    id: 'thailand',
    regionId: 'asia',
    nameHe: 'תאילנד',
    nameEn: 'Thailand',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526',
    description: '"ארץ החיוכים" מציעה חופים טרופיים, מקדשים מרהיבים, אוכל מצוין ותרבות עשירה.',
    currency: 'באט תאילנדי (THB)',
    language: 'תאית',
    timeZone: 'GMT+7',
    bestTimeToVisit: 'נובמבר-פברואר',
    recommendedApps: [
      {
        id: 'grab',
        name: 'Grab',
        category: 'transportation',
        description: 'אפליקציית הסעות ומשלוחים הפופולרית ביותר בתאילנד, מציעה גם משלוחי מזון ושירותים נוספים.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.grab.com',
        appStoreLink: 'https://apps.apple.com/app/grab-app/id647268330',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.grabtaxi.passenger'
      },
      {
        id: 'foodpanda_thailand',
        name: 'foodpanda',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי בתאילנד, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.foodpanda.co.th',
        appStoreLink: 'https://apps.apple.com/app/foodpanda-food-delivery/id758103884',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.global.foodpanda.android'
      },
      {
        id: 'bolt_thailand',
        name: 'Bolt',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית בתאילנד, מציעה מחירים תחרותיים.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://bolt.eu',
        appStoreLink: 'https://apps.apple.com/app/bolt-fast-affordable-rides/id675033630',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=ee.mtakso.client'
      }
    ]
  },
  {
    id: 'india',
    regionId: 'asia',
    nameHe: 'הודו',
    nameEn: 'India',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
    description: 'ארץ עם מגוון עצום של תרבויות, דתות, נופים ומטבחים. הודו מציעה חוויה ייחודית לכל מטייל.',
    currency: 'רופי הודי (INR)',
    language: 'הינדי, אנגלית ושפות רבות נוספות',
    timeZone: 'GMT+5:30',
    bestTimeToVisit: 'אוקטובר-מרץ',
    recommendedApps: [
      {
        id: 'ola',
        name: 'Ola',
        category: 'transportation',
        description: 'אפליקציית הסעות הפופולרית ביותר בהודו, מציעה מגוון אפשרויות נסיעה.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.olacabs.com',
        appStoreLink: 'https://apps.apple.com/app/ola-cabs/id539179365',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.olacabs.customer'
      },
      {
        id: 'zomato',
        name: 'Zomato',
        category: 'food',
        description: 'אפליקציית משלוחי מזון וביקורות מסעדות פופולרית בהודו.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.zomato.com',
        appStoreLink: 'https://apps.apple.com/app/zomato-food-delivery-dining/id434613896',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.application.zomato'
      }
    ]
  },

  // North America
  {
    id: 'usa',
    regionId: 'north_america',
    nameHe: 'ארצות הברית',
    nameEn: 'United States',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
    description: 'מדינה עצומה עם מגוון רחב של נופים, ערים גדולות, פארקים לאומיים ואטרקציות.',
    currency: 'דולר אמריקאי (USD)',
    language: 'אנגלית',
    timeZone: 'מספר אזורי זמן',
    bestTimeToVisit: 'תלוי באזור',
    recommendedApps: [
      {
        id: 'uber',
        name: 'Uber',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית בארה"ב, זמינה ברוב הערים הגדולות.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.uber.com',
        appStoreLink: 'https://apps.apple.com/app/uber/id368677368',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.ubercab'
      },
      {
        id: 'doordash',
        name: 'DoorDash',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי בארה"ב, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.doordash.com',
        appStoreLink: 'https://apps.apple.com/app/doordash-food-delivery/id719972451',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.dd.doordash'
      }
    ]
  },
  {
    id: 'mexico',
    regionId: 'north_america',
    nameHe: 'מקסיקו',
    nameEn: 'Mexico',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de',
    description: 'ארץ עם היסטוריה עשירה, תרבות צבעונית, חופים מרהיבים ואוכל מצוין.',
    currency: 'פסו מקסיקני (MXN)',
    language: 'ספרדית',
    timeZone: 'GMT-6 עד GMT-8',
    bestTimeToVisit: 'דצמבר-אפריל',
    recommendedApps: [
      {
        id: 'didi',
        name: 'DiDi',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית במקסיקו, מציעה מחירים תחרותיים.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.didiglobal.com',
        appStoreLink: 'https://apps.apple.com/app/didi-ride-hailing/id1330867582',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.didiglobal.passenger'
      },
      {
        id: 'rappi',
        name: 'Rappi',
        category: 'food',
        description: 'שירות משלוחים פופולרי במקסיקו, מציע מזון, מצרכים ועוד.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.rappi.com.mx',
        appStoreLink: 'https://apps.apple.com/app/rappi/id980267667',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.grability.rappi'
      }
    ]
  },

  // South America
  {
    id: 'brazil',
    regionId: 'south_america',
    nameHe: 'ברזיל',
    nameEn: 'Brazil',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325',
    description: 'ארץ הסמבה, הכדורגל ויערות האמזונס. ברזיל מציעה חופים מרהיבים, ערים תוססות וטבע מדהים.',
    currency: 'ריאל ברזילאי (BRL)',
    language: 'פורטוגזית',
    timeZone: 'GMT-3 עד GMT-5',
    bestTimeToVisit: 'מאי-ספטמבר',
    recommendedApps: [
      {
        id: '99',
        name: '99',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית בברזיל, מציעה מגוון אפשרויות נסיעה.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://99app.com',
        appStoreLink: 'https://apps.apple.com/app/99-taxi-e-motorista-particular/id553663691',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.taxis99'
      },
      {
        id: 'ifood',
        name: 'iFood',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי בברזיל, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.ifood.com.br',
        appStoreLink: 'https://apps.apple.com/app/ifood-delivery-de-comida/id483017239',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=br.com.brainweb.ifood'
      }
    ]
  },
  {
    id: 'peru',
    regionId: 'south_america',
    nameHe: 'פרו',
    nameEn: 'Peru',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
    description: 'בית למאצ\'ו פיצ\'ו ולתרבות האינקה העתיקה. פרו מציעה נופים מרהיבים, היסטוריה עשירה ואוכל מצוין.',
    currency: 'סול פרואני (PEN)',
    language: 'ספרדית',
    timeZone: 'GMT-5',
    bestTimeToVisit: 'מאי-אוקטובר',
    recommendedApps: [
      {
        id: 'cabify_peru',
        name: 'Cabify',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית בפרו, מציעה שירות איכותי ובטוח.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://cabify.com/peru',
        appStoreLink: 'https://apps.apple.com/app/cabify/id476087442',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.cabify.rider'
      },
      {
        id: 'rappi_peru',
        name: 'Rappi',
        category: 'food',
        description: 'שירות משלוחים פופולרי בפרו, מציע מזון, מצרכים ועוד.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.rappi.com.pe',
        appStoreLink: 'https://apps.apple.com/app/rappi/id980267667',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.grability.rappi'
      }
    ]
  },

  // Africa
  {
    id: 'south_africa',
    regionId: 'africa',
    nameHe: 'דרום אפריקה',
    nameEn: 'South Africa',
    image: 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3',
    description: 'מדינה עם נופים מרהיבים, חיות בר, יינות משובחים וערים מודרניות.',
    currency: 'ראנד דרום אפריקאי (ZAR)',
    language: 'אנגלית, אפריקאנס ושפות נוספות',
    timeZone: 'GMT+2',
    bestTimeToVisit: 'מאי-אוקטובר',
    recommendedApps: [
      {
        id: 'bolt_sa',
        name: 'Bolt',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית בדרום אפריקה, מציעה מחירים תחרותיים.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://bolt.eu/en-za',
        appStoreLink: 'https://apps.apple.com/app/bolt-fast-affordable-rides/id675033630',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=ee.mtakso.client'
      },
      {
        id: 'mr_d_food',
        name: 'Mr D Food',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי בדרום אפריקה, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.mrdfood.com',
        appStoreLink: 'https://apps.apple.com/app/mr-d-food-delivery/id1072718022',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.mrdfood.android'
      }
    ]
  },
  {
    id: 'morocco',
    regionId: 'africa',
    nameHe: 'מרוקו',
    nameEn: 'Morocco',
    image: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3',
    description: 'ארץ עם תרבות עשירה, שווקים צבעוניים, מדבריות, הרים ואוכל מצוין.',
    currency: 'דירהם מרוקאי (MAD)',
    language: 'ערבית, ברברית, צרפתית',
    timeZone: 'GMT+1',
    bestTimeToVisit: 'מרץ-מאי, ספטמבר-נובמבר',
    recommendedApps: [
      {
        id: 'careem',
        name: 'Careem',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית במרוקו, מציעה שירות איכותי.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.careem.com',
        appStoreLink: 'https://apps.apple.com/app/careem-rides-food-delivery/id592978487',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.careem.acma'
      },
      {
        id: 'glovo_morocco',
        name: 'Glovo',
        category: 'food',
        description: 'שירות משלוחים פופולרי במרוקו, מציע מזון, מצרכים ועוד.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.glovoapp.com/ma',
        appStoreLink: 'https://apps.apple.com/app/glovo-food-delivery-more/id1023238670',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.glovo.android'
      }
    ]
  },

  // Oceania
  {
    id: 'australia',
    regionId: 'oceania',
    nameHe: 'אוסטרליה',
    nameEn: 'Australia',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
    description: 'מדינה עם חופים מרהיבים, ערים מודרניות, חיות ייחודיות ונופים מגוונים.',
    currency: 'דולר אוסטרלי (AUD)',
    language: 'אנגלית',
    timeZone: 'GMT+8 עד GMT+10',
    bestTimeToVisit: 'ספטמבר-נובמבר, מרץ-מאי',
    recommendedApps: [
      {
        id: 'uber_australia',
        name: 'Uber',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית באוסטרליה, זמינה ברוב הערים הגדולות.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.uber.com/au',
        appStoreLink: 'https://apps.apple.com/app/uber/id368677368',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.ubercab'
      },
      {
        id: 'menulog',
        name: 'Menulog',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי באוסטרליה, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.menulog.com.au',
        appStoreLink: 'https://apps.apple.com/app/menulog-food-delivery/id327982905',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=au.com.menulog'
      }
    ]
  },
  {
    id: 'new_zealand',
    regionId: 'oceania',
    nameHe: 'ניו זילנד',
    nameEn: 'New Zealand',
    image: 'https://images.unsplash.com/photo-1469521669194-babb45599def',
    description: 'מדינה עם נופים מרהיבים, הרים, אגמים, חופים ואפשרויות רבות לפעילויות אקסטרים.',
    currency: 'דולר ניו זילנדי (NZD)',
    language: 'אנגלית, מאורית',
    timeZone: 'GMT+12',
    bestTimeToVisit: 'דצמבר-פברואר, מרץ-מאי',
    recommendedApps: [
      {
        id: 'uber_nz',
        name: 'Uber',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית בניו זילנד, זמינה בערים הגדולות.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.uber.com/nz',
        appStoreLink: 'https://apps.apple.com/app/uber/id368677368',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.ubercab'
      },
      {
        id: 'delivereasy',
        name: 'DeliverEasy',
        category: 'food',
        description: 'שירות משלוחי מזון מקומי בניו זילנד, מציע מגוון מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.delivereasy.co.nz',
        appStoreLink: 'https://apps.apple.com/app/delivereasy/id1216343314',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=nz.co.delivereasy.customer'
      }
    ]
  },

  // Middle East
  {
    id: 'israel',
    regionId: 'middle_east',
    nameHe: 'ישראל',
    nameEn: 'Israel',
    image: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190',
    description: 'מדינה עם היסטוריה עשירה, אתרים קדושים, חופים, מדבריות וערים מודרניות.',
    currency: 'שקל חדש (ILS)',
    language: 'עברית, ערבית',
    timeZone: 'GMT+2/3',
    bestTimeToVisit: 'מרץ-מאי, ספטמבר-נובמבר',
    recommendedApps: [
      {
        id: 'gett',
        name: 'Gett',
        category: 'transportation',
        description: 'אפליקציית מוניות פופולרית בישראל, מציעה שירות איכותי.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://gett.com/il',
        appStoreLink: 'https://apps.apple.com/app/gett-taxi/id449655162',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.gettaxi.android'
      },
      {
        id: 'wolt',
        name: 'Wolt',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי בישראל, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://wolt.com/il',
        appStoreLink: 'https://apps.apple.com/app/wolt-food-delivery/id943905271',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.wolt.android'
      }
    ]
  },
  {
    id: 'jordan',
    regionId: 'middle_east',
    nameHe: 'ירדן',
    nameEn: 'Jordan',
    image: 'https://images.unsplash.com/photo-1570269691511-2a0f95a7fd95',
    description: 'בית לפטרה ולים המלח. ירדן מציעה אתרים היסטוריים, נופי מדבר מרהיבים ותרבות עשירה.',
    currency: 'דינר ירדני (JOD)',
    language: 'ערבית',
    timeZone: 'GMT+3',
    bestTimeToVisit: 'מרץ-מאי, ספטמבר-נובמבר',
    recommendedApps: [
      {
        id: 'careem_jordan',
        name: 'Careem',
        category: 'transportation',
        description: 'אפליקציית הסעות פופולרית בירדן, מציעה שירות איכותי.',
        icon: 'https://images.unsplash.com/photo-1581262177000-8139a463e531',
        website: 'https://www.careem.com',
        appStoreLink: 'https://apps.apple.com/app/careem-rides-food-delivery/id592978487',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.careem.acma'
      },
      {
        id: 'talabat',
        name: 'Talabat',
        category: 'food',
        description: 'שירות משלוחי מזון פופולרי בירדן, מציע מגוון רחב של מסעדות.',
        icon: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        website: 'https://www.talabat.com/jordan',
        appStoreLink: 'https://apps.apple.com/app/talabat-food-delivery/id451001072',
        googlePlayLink: 'https://play.google.com/store/apps/details?id=com.talabat'
      }
    ]
  }
];