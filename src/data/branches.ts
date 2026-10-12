// ---------------------------------------------------------------------------
// BRANCH DATA
// ---------------------------------------------------------------------------
// Single source of truth for Doddmane Oota branches, shown as a compact
// card row on the homepage. Only the KR Puram kitchen is verified (see
// src/data/restaurant.ts). Do NOT invent additional branches or addresses —
// add real ones here as they open.
// ---------------------------------------------------------------------------

import { restaurant } from './restaurant'

export interface Branch {
  id: string
  /** Display name, e.g. "Dodda Mane Oota — KR Puram". */
  name: string
  address: string
  area: string
  city: string
  pincode: string
  phoneDisplay: string
  phoneHref: string
  hours: string
  /** Google Maps search URL built from the verified coordinates. */
  mapUrl: string
  /** Photograph. Placeholder until the restaurant supplies real photos. */
  image: string
  verified: boolean
}

const v = restaurant.verified

export const branches: Branch[] = [
  {
    id: 'kr-puram',
    name: `${restaurant.name} — ${v.area}`,
    address: v.address,
    area: v.area,
    city: v.city,
    pincode: v.pincode,
    phoneDisplay: v.phoneDisplay,
    phoneHref: v.phoneHref,
    hours: v.hours,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${v.lat}%2C${v.lng}`,
    image: '/bgdm1.png',
    verified: true,
  },
]
