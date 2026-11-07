import type { Category, MenuItem } from '@/types';

export const CATEGORIES: Category[] = [
  'BBQ Meals',
  'Fried Meals',
  'Burgers & Rolls',
  'Seafood Meals',
  'Sides',
  'Drinks',
  'Ice Cream',
];

/**
 * Wickid Chicken Lae menu. Prices are in Kina (PGK).
 * Items with `price: 0` have no confirmed price yet and ship as unavailable —
 * set the real price before switching them on in the Admin dashboard.
 */
export const MENU_ITEMS: MenuItem[] = [
  // BBQ Meals
  { id: 'bbq-quick-snack', name: 'Quick Snack BBQ', description: '1/8 BBQ chicken with chips', price: 14.5, category: 'BBQ Meals', emoji: '🍗', available: true },
  { id: 'bbq-quarter-pack', name: '1/4 BBQ Pack', description: 'Quarter BBQ chicken pack', price: 22.5, category: 'BBQ Meals', emoji: '🍗', available: true },
  { id: 'bbq-half-pack', name: '1/2 BBQ Pack', description: 'Half BBQ chicken pack', price: 31.5, category: 'BBQ Meals', emoji: '🍗', available: true },
  { id: 'bbq-coleslaw', name: 'BBQ & Coleslaw', description: 'BBQ chicken served with coleslaw', price: 24.0, category: 'BBQ Meals', emoji: '🥗', available: true },
  { id: 'bbq-dinner', name: 'BBQ Dinner', description: 'BBQ chicken dinner', price: 25.0, category: 'BBQ Meals', emoji: '🍽️', available: true },
  { id: 'bbq-half-chicken', name: '1/2 BBQ Chicken', description: 'Half BBQ chicken', price: 22.0, category: 'BBQ Meals', emoji: '🐔', available: true },
  { id: 'bbq-whole-chicken', name: 'Whole BBQ Chicken', description: 'Whole BBQ chicken', price: 39.9, category: 'BBQ Meals', emoji: '🐔', available: true },
  { id: 'bbq-family-dinner', name: 'Family BBQ Dinner', description: 'BBQ chicken dinner for the family', price: 79.5, category: 'BBQ Meals', emoji: '👨‍👩‍👧‍👦', available: true },

  // Fried Meals
  { id: 'fried-piece', name: 'Fried Chicken Piece', description: 'Single piece of fried chicken', price: 7.7, category: 'Fried Meals', emoji: '🍗', available: true },
  { id: 'fried-quick-snack', name: 'Quick Snack Fried', description: 'Fried chicken snack pack', price: 14.5, category: 'Fried Meals', emoji: '🍟', available: true },
  { id: 'fried-double-pack', name: 'Double Fried Pack', description: 'Two-piece fried chicken pack', price: 22.5, category: 'Fried Meals', emoji: '🍗', available: true },
  { id: 'fried-coleslaw', name: 'Fried & Coleslaw', description: 'Fried chicken served with coleslaw', price: 24.0, category: 'Fried Meals', emoji: '🥗', available: true },
  { id: 'fried-five-pieces', name: '5 Pieces Fried Chicken', description: 'Five pieces of fried chicken', price: 25.0, category: 'Fried Meals', emoji: '🍗', available: true },
  { id: 'fried-dinner', name: 'Fried Dinner', description: 'Fried chicken dinner', price: 25.0, category: 'Fried Meals', emoji: '🍽️', available: true },
  { id: 'fried-family-dinner', name: 'Family Fried Dinner', description: 'Fried chicken dinner for the family', price: 63.0, category: 'Fried Meals', emoji: '👨‍👩‍👧‍👦', available: true },
  { id: 'fried-triple-pack', name: 'Triple Fried Pack', description: 'Three-piece fried chicken pack', price: 31.5, category: 'Fried Meals', emoji: '🍗', available: true },

  // Burgers & Rolls
  { id: 'burger-chicken-fillet', name: 'Chicken Fillet Burger', description: 'Crumbed chicken fillet burger', price: 12.7, category: 'Burgers & Rolls', emoji: '🍔', available: true },
  { id: 'burger-grilled-chicken', name: 'Marinated Grilled Chicken Burger', description: 'Marinated grilled chicken burger', price: 14.7, category: 'Burgers & Rolls', emoji: '🍔', available: true },
  { id: 'burger-chicken-parmi', name: 'Chicken Parmi Burger', description: 'Chicken parmigiana burger', price: 15.9, category: 'Burgers & Rolls', emoji: '🍔', available: true },
  { id: 'roll-chicken-mayo', name: 'Chicken & Mayo Roll', description: 'Chicken and mayonnaise roll', price: 0, category: 'Burgers & Rolls', emoji: '🥖', available: false },
  { id: 'burger-classic-beef', name: 'Classic Beef Burger', description: 'Classic beef burger', price: 13.8, category: 'Burgers & Rolls', emoji: '🍔', available: true },
  { id: 'burger-beef-cheese', name: 'Beef & Cheese Burger', description: 'Beef burger with cheese', price: 12.9, category: 'Burgers & Rolls', emoji: '🧀', available: true },
  { id: 'burger-double-beef-cheese', name: 'Double Beef & Cheese Burger', description: 'Two beef patties with cheese', price: 19.5, category: 'Burgers & Rolls', emoji: '🍔', available: true },
  { id: 'burger-wickid-work', name: 'Wickid Work Burger', description: 'The Wickid burger with the works', price: 19.5, category: 'Burgers & Rolls', emoji: '🔥', available: true },

  // Seafood Meals
  { id: 'sea-quick-fish', name: 'Quick Fish Pack', description: 'Fish snack pack', price: 17.7, category: 'Seafood Meals', emoji: '🐟', available: true },
  { id: 'sea-double-fish', name: 'Double Fish Pack', description: 'Two-piece fish pack', price: 27.8, category: 'Seafood Meals', emoji: '🐟', available: true },
  { id: 'sea-seafood-meal', name: 'Seafood Meal', description: 'Mixed seafood meal', price: 37.9, category: 'Seafood Meals', emoji: '🦐', available: true },
  { id: 'sea-prawn-cutlet', name: 'Battered Prawn Cutlet', description: 'Single battered prawn cutlet', price: 4.5, category: 'Seafood Meals', emoji: '🍤', available: true },
  { id: 'sea-calamari-ring', name: 'Battered Calamari Ring', description: 'Single battered calamari ring', price: 4.0, category: 'Seafood Meals', emoji: '🦑', available: true },

  // Sides
  { id: 'side-chips-regular', name: 'Hot Chips Regular', description: 'Regular serve of hot chips', price: 6.2, category: 'Sides', emoji: '🍟', available: true },
  { id: 'side-chips-large', name: 'Hot Chips Large', description: 'Large serve of hot chips', price: 11.4, category: 'Sides', emoji: '🍟', available: true },
  { id: 'side-coleslaw-regular', name: 'Coleslaw Regular', description: 'Regular serve of coleslaw', price: 7.5, category: 'Sides', emoji: '🥗', available: true },
  { id: 'side-veg-regular', name: 'Mixed Vegetables Regular', description: 'Regular serve of mixed vegetables', price: 6.5, category: 'Sides', emoji: '🥦', available: true },
  { id: 'side-veg-large', name: 'Mixed Vegetables Large', description: 'Large serve of mixed vegetables', price: 11.5, category: 'Sides', emoji: '🥦', available: true },
  { id: 'side-garlic-cheese-ball', name: 'Garlic Cheese Ball', description: 'Single garlic cheese ball', price: 4.8, category: 'Sides', emoji: '🧀', available: true },
  { id: 'side-garlic-bread', name: 'Garlic Bread', description: 'Toasted garlic bread', price: 5.0, category: 'Sides', emoji: '🥖', available: true },
  { id: 'side-mash-pumpkin', name: 'Mashed Potato & Pumpkin', description: 'Mashed potato and pumpkin', price: 1.6, category: 'Sides', emoji: '🎃', available: true },
  { id: 'side-chicken-tenders', name: 'Hot & Spicy Chicken Tenders', description: 'Hot and spicy chicken tenders', price: 0, category: 'Sides', emoji: '🌶️', available: false },
  { id: 'side-chicken-nuggets', name: 'Chicken Nuggets', description: 'Crumbed chicken nuggets', price: 0, category: 'Sides', emoji: '🍗', available: false },
  { id: 'side-fish-bites', name: 'Fish Bites', description: 'Battered fish bites', price: 0, category: 'Sides', emoji: '🐠', available: false },

  // Drinks
  { id: 'drink-can', name: 'Can Drink', description: 'Assorted soft drink can', price: 3.0, category: 'Drinks', emoji: '🥤', available: true },
  { id: 'drink-pure-water', name: 'Pure Water 600ml', description: '600 ml bottled water', price: 3.5, category: 'Drinks', emoji: '💧', available: true },
  { id: 'drink-vita-juice', name: 'Vita Juice', description: 'Vita fruit juice', price: 3.6, category: 'Drinks', emoji: '🧃', available: true },
  { id: 'drink-kk-energy', name: 'KK Energy Drink', description: 'KK energy drink', price: 3.3, category: 'Drinks', emoji: '⚡', available: true },
  { id: 'drink-sunkist', name: 'Sunkist Juice', description: 'Sunkist juice', price: 3.0, category: 'Drinks', emoji: '🍊', available: true },
  { id: 'drink-slushy', name: 'Slushy Drink', description: 'Frozen slushy drink', price: 3.2, category: 'Drinks', emoji: '🧊', available: true },

  // Ice Cream
  { id: 'ice-cone', name: 'Soft Serve Cone', description: 'Soft serve ice cream cone', price: 4.5, category: 'Ice Cream', emoji: '🍦', available: true },
  { id: 'ice-sundae', name: 'Soft Serve Sundae Cup', description: 'Soft serve sundae in a cup', price: 6.0, category: 'Ice Cream', emoji: '🍨', available: true },
];
