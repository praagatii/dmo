// ---------------------------------------------------------------------------
// MENU DATA
// ---------------------------------------------------------------------------
// Source of truth: the supplied Doddmane Oota menu screenshots. These 18 items
// across Veg / Egg / Chicken are the exact items and prices for the initial
// demo menu. Do not add invented items here.
//
// The `image` paths point at temporary placeholder photographs in
// /public/images/menu/<id>.jpg (sourced from TheMealDB's free API, chosen to
// roughly match each dish type). They are intentionally kept separate from this
// data so each placeholder can be swapped for a real Doddmane Oota photograph
// later without touching any component.
//
// Descriptions are deliberately minimal and are only added where safe; do not
// fabricate ingredients, dietary or health claims.
// ---------------------------------------------------------------------------

export interface MenuItem {
  id: string
  name: string
  desc?: string
  /** Whole rupees. */
  price: number
  image: string
  category: string
  tags?: string[]
}

export interface MenuCategory {
  id: string
  name: string
  /** Kannada label shown beside the English category name. */
  kannada: string
}

export const menuCategories: MenuCategory[] = [
  { id: 'veg', name: 'Veg', kannada: 'ಸಸ್ಯಾಹಾರಿ' },
  { id: 'egg', name: 'Egg', kannada: 'ಮೊಟ್ಟೆ ವಿಧಗಳು' },
  { id: 'chicken', name: 'Chicken', kannada: 'ಚಿಕನ್' },
]

export const menuItems: MenuItem[] = [
  // --- Veg -------------------------------------------------------------
  {
    id: 'anabe-sukka-roll',
    name: 'Anabe Sukka Roll',
    price: 220,
    image: '/images/menu/anabe-sukka-roll.jpg',
    category: 'veg',
  },
  {
    id: 'kempu-bejjule-cauliflower',
    name: 'Kempu Bejjule Cauliflower',
    price: 120,
    image: '/images/menu/kempu-bejjule-cauliflower.jpg',
    category: 'veg',
  },
  {
    id: 'takoli-gasi',
    name: 'Takoli Gasi',
    price: 180,
    image: '/images/menu/takoli-gasi.jpg',
    category: 'veg',
  },
  {
    id: 'paneer-ghee-roast',
    name: 'Paneer Ghee Roast',
    price: 220,
    image: '/images/menu/paneer-ghee-roast.jpg',
    category: 'veg',
  },
  {
    id: 'veg-fried-rice',
    name: 'Veg Fried Rice',
    price: 120,
    image: '/images/menu/veg-fried-rice.jpg',
    category: 'veg',
  },

  // --- Egg -------------------------------------------------------------
  {
    id: 'egg-ghee-roast',
    name: 'Egg Ghee Roast',
    price: 220,
    image: '/images/menu/egg-ghee-roast.jpg',
    category: 'egg',
  },
  {
    id: 'egg-omelette-curry',
    name: 'Egg Omelette Curry',
    price: 220,
    image: '/images/menu/egg-omelette-curry.jpg',
    category: 'egg',
  },
  {
    id: 'egg-fried-rice',
    name: 'Egg Fried Rice',
    price: 120,
    image: '/images/menu/egg-fried-rice.jpg',
    category: 'egg',
  },
  {
    id: 'egg-biryani',
    name: 'Egg Biryani',
    price: 180,
    image: '/images/menu/egg-biryani.jpg',
    category: 'egg',
  },

  // --- Chicken ---------------------------------------------------------
  {
    id: 'kori-sukka',
    name: 'Kori Sukka',
    price: 269,
    image: '/images/menu/kori-sukka.jpg',
    category: 'chicken',
  },
  {
    id: 'kakinada-chicken',
    name: 'Kakinada Chicken',
    price: 269,
    image: '/images/menu/kakinada-chicken.jpg',
    category: 'chicken',
  },
  {
    id: 'chicken-pepper-dry',
    name: 'Chicken Pepper Dry',
    price: 270,
    image: '/images/menu/chicken-pepper-dry.jpg',
    category: 'chicken',
  },
  {
    id: 'chicken-fry',
    name: 'Chicken Fry',
    price: 260,
    image: '/images/menu/chicken-fry.jpg',
    category: 'chicken',
  },
  {
    id: 'chicken-65-special',
    name: 'Chicken 65 Special',
    price: 269,
    image: '/images/menu/chicken-65-special.jpg',
    category: 'chicken',
  },
  {
    id: 'chicken-lollipop',
    name: 'Chicken Lollipop',
    price: 280,
    image: '/images/menu/chicken-lollipop.jpg',
    category: 'chicken',
  },
  {
    id: 'chilly-chicken',
    name: 'Chilly Chicken',
    price: 260,
    image: '/images/menu/chilly-chicken.jpg',
    category: 'chicken',
  },
  {
    id: 'chicken-kabab',
    name: 'Chicken Kabab',
    price: 260,
    image: '/images/menu/chicken-kabab.jpg',
    category: 'chicken',
  },
  {
    id: 'kobi-gasi',
    name: 'Kobi Gasi',
    price: 289,
    image: '/images/menu/kobi-gasi.jpg',
    category: 'chicken',
  },
]

export function itemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((m) => m.category === categoryId)
}

export function findMenuItem(id: string): MenuItem | undefined {
  return menuItems.find((m) => m.id === id)
}
