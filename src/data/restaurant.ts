/**
 * Dodda Mane Oota — business data
 * ----------------------------------------------------------------------------
 * IMPORTANT / DATA PROVENANCE
 *
 * Everything under `verified` was cross-checked against public listings
 * (Zomato/District restaurant listing + the @doddmaneoota Instagram bio).
 * Anything NOT verifiable has been left out rather than invented.
 *
 * Still unverified and deliberately generic on this site:
 *   - Official logo / brand marks (a typographic wordmark is used instead)
 *   - Official email address
 *   - An itemised, priced menu (the venue serves a rotating daily oota, so
 *     the site describes the *format* of a Karnataka oota rather than
 *     publishing prices we cannot confirm)
 *
 * Replace `verified` values only with confirmed updates from the restaurant.
 */

export type SectionId =
  | 'hero'
  | 'story'
  | 'oota'
  | 'dining'
  | 'gallery'
  | 'visit'

export interface Restaurant {
  name: string
  nameKannada: string
  listingName: string
  greeting: string
  greetingMeaning: string
  verified: {
    address: string
    area: string
    city: string
    pincode: string
    lat: number
    lng: number
    phoneDisplay: string
    phoneHref: string
    hours: string
    costForTwo: string
    cuisines: string[]
    instagramHandle: string
    instagramUrl: string
  }
  sourcing: {
    listingSource: string
    listingUrl: string
    instagramUrl: string
    verifiedOn: string
  }
}

export const restaurant: Restaurant = {
  name: 'Dodda Mane Oota',
  nameKannada: 'ದೊಡ್ಡ ಮನೆ ಊಟ',
  listingName: 'Doddmane Oota Veg And Non Veg',
  greeting: 'ಊಟ ಆಯ್ತಾ?',
  greetingMeaning: 'Have you eaten?',
  verified: {
    address: '98/5, Kithaganoor, Halehalli Main Road',
    area: 'KR Puram',
    city: 'Bengaluru',
    pincode: '560036',
    lat: 13.035949,
    lng: 77.707389,
    phoneDisplay: '+91 81971 81496',
    phoneHref: '+918197181496',
    hours: '8:30 AM – 10:30 PM',
    costForTwo: '₹200 for two',
    cuisines: ['South Indian', 'North Indian', 'Indo-Chinese'],
    instagramHandle: '@doddmaneoota',
    instagramUrl: 'https://www.instagram.com/doddmaneoota',
  },
  sourcing: {
    listingSource: 'Zomato / District listing',
    listingUrl:
      'https://www.district.in/dining/bangalore/doddmane-oota-veg-and-non-veg-kr-puram-bangalore',
    instagramUrl: 'https://www.instagram.com/doddmaneoota',
    verifiedOn: '2026-10',
  },
}

/** Traditional Karnataka oota components — cultural context, not a claimed menu. */
export const ootaElements: { kannada: string; name: string; note: string }[] = [
  {
    kannada: 'ಅನ್ನ',
    name: 'Anna',
    note: 'Steamed rice, the heart of the leaf.',
  },
  {
    kannada: 'ಸಾರು',
    name: 'Saaru',
    note: 'Peppery rasam to open the appetite.',
  },
  {
    kannada: 'ಪಲ್ಯ',
    name: 'Palya',
    note: 'Seasonal vegetable stir-fry, coconut-kissed.',
  },
  {
    kannada: 'ಕೋಸಂಬರಿ',
    name: 'Kosambari',
    note: 'Cool lentil and cucumber salad.',
  },
  {
    kannada: 'ಹಪ್ಪಳ',
    name: 'Happala',
    note: 'Crisp sun-dried papad.',
  },
  {
    kannada: 'ಪಾಯಸ',
    name: 'Payasa',
    note: 'Sweet jaggery-and-milk finish.',
  },
]

export const navSections: { id: SectionId; label: string; kannada: string }[] = [
  { id: 'hero', label: 'Welcome', kannada: 'ಸ್ವಾಗತ' },
  { id: 'story', label: 'Our Story', kannada: 'ನಮ್ಮ ಕಥೆ' },
  { id: 'oota', label: 'The Oota', kannada: 'ಊಟ' },
  { id: 'dining', label: 'Dining', kannada: 'ಉಪಚಾರ' },
  { id: 'gallery', label: 'Gallery', kannada: 'ಚಿತ್ರಗಳು' },
  { id: 'visit', label: 'Visit', kannada: 'ಭೇಟಿ' },
]
