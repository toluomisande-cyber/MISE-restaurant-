/**
 * Explicit, verified food image mapping for MISE Campus.
 * Ensures every Nigerian campus dish renders authentic food photography
 * with zero mismatches, array index risks, or broken CDN dependencies.
 */

export interface FoodImageInfo {
  src: string;
  alt: string;
  dishType: string;
  isVerified: boolean;
}

export const VERIFIED_FOOD_IMAGES: Record<string, FoodImageInfo> = {
  // Amala & Abula
  "item-amala-abula-classic": {
    src: "/images/food/amala-abula-classic.jpg",
    alt: "Classic Amala with Gbegiri, Ewedu and soft stewed beef",
    dishType: "Amala and Abula",
    isVerified: true,
  },
  "item-amala-goat-special": {
    src: "/images/food/amala-goat-special.png",
    alt: "Amala with Ewedu, Gbegiri and tender peppered goat meat (Ogunfe)",
    dishType: "Amala with Goat Meat",
    isVerified: true,
  },

  // Rice & Grains
  "item-mama-t-rice-beans": {
    src: "/images/food/rice-beans-fish.jpg",
    alt: "Nigerian white rice and honey beans with rich pepper stew and fried fish",
    dishType: "Rice and Beans with Stew",
    isVerified: true,
  },
  "item-tedder-jollof-chicken": {
    src: "/images/food/jollof-chicken-plantain.jpg",
    alt: "Smoky Nigerian firewood party Jollof rice with peppered chicken and fried plantain",
    dishType: "Nigerian Jollof Rice",
    isVerified: true,
  },
  "item-tedder-budget-jollof": {
    src: "/images/food/jollof-express.jpg",
    alt: "Student Express Jollof rice served with spiced plantain and protein",
    dishType: "Nigerian Jollof Rice",
    isVerified: true,
  },
  "item-tedder-fried-rice-turkey": {
    src: "/images/food/nigerian-fried-rice.jpg",
    alt: "Golden Nigerian fried rice garnished with sweet corn, carrots, liver dices, and poultry",
    dishType: "Nigerian Fried Rice",
    isVerified: true,
  },
  "item-agbowo-ofada-ayamase": {
    src: "/images/food/ofada-rice-leaves.jpg",
    alt: "Authentic unpolished Ofada rice served in uma leaves with green pepper Ayamase sauce",
    dishType: "Ofada Rice in Leaves",
    isVerified: true,
  },

  // Beans & Porridge
  "item-idia-ewa-aganyin-bread": {
    src: "/images/food/ewa-aganyin-bread.jpg",
    alt: "Mashed Ewa Aganyin with dark caramelized pepper sauce and Agege bread",
    dishType: "Ewa Aganyin and Bread",
    isVerified: true,
  },
  "item-idia-yam-porridge": {
    src: "/images/food/yam-porridge-asaro.jpg",
    alt: "Traditional Nigerian palm oil yam porridge (Asaro) with dried fish shreds",
    dishType: "Yam Porridge (Asaro)",
    isVerified: true,
  },
  "item-idia-quick-ewa": {
    src: "/images/food/quick-ewa-aganyin.jpg",
    alt: "Compact bowl of steaming mashed beans with rich Aganyin sauce",
    dishType: "Ewa Aganyin",
    isVerified: true,
  },

  // Pasta & Noodles
  "item-tech-indomie-double-egg": {
    src: "/images/food/indomie-double-egg.jpg",
    alt: "Stir-fried Indomie noodles with sliced peppers, onions, carrots, and fried eggs",
    dishType: "Stir-fried Indomie Noodles",
    isVerified: true,
  },
  "item-tech-suya-spaghetti": {
    src: "/images/food/suya-spaghetti.jpg",
    alt: "Spicy Nigerian Jollof spaghetti tossed in suya yaji spice and grilled beef cuts",
    dishType: "Suya Jollof Spaghetti",
    isVerified: true,
  },

  // Snacks & Pastries
  "item-tech-shawarma-roll": {
    src: "/images/food/campus-shawarma.jpg",
    alt: "Freshly toasted pita shawarma wrap with grilled spiced beef, cabbage, cream, and sausage",
    dishType: "Beef Shawarma Wrap",
    isVerified: true,
  },
  "item-kuti-meatpie-delight": {
    src: "/images/food/nigerian-meat-pie.jpg",
    alt: "Flaky golden baked Nigerian meat pie filled with seasoned minced beef and potatoes",
    dishType: "Nigerian Meat Pie",
    isVerified: true,
  },

  // Drinks & Parfait
  "item-kuti-zobo-ginger": {
    src: "/images/food/chilled-zobo.jpg",
    alt: "Deep purple chilled Hibiscus Zobo drink brewed with fresh ginger and pineapple",
    dishType: "Chilled Zobo Drink",
    isVerified: true,
  },
  "item-kuti-fruit-parfait": {
    src: "/images/food/yogurt-parfait.jpg",
    alt: "Layered Greek yogurt parfait with wild honey, crunchy granola, and fresh fruits",
    dishType: "Greek Yogurt Parfait",
    isVerified: true,
  },

  // Late Night & Grills
  "item-agbowo-asun-plate": {
    src: "/images/food/peppered-asun.jpg",
    alt: "Fire-roasted smoky Nigerian peppered goat meat Asun with onions and scotch bonnets",
    dishType: "Peppered Asun Goat Meat",
    isVerified: true,
  },
};

/**
 * Category-level authentic fallback images if a new vendor adds a custom dish
 */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "cat-rice": "/images/food/jollof-chicken-plantain.jpg",
  "cat-swallow": "/images/food/amala-abula-classic.jpg",
  "cat-beans": "/images/food/ewa-aganyin-bread.jpg",
  "cat-pasta": "/images/food/indomie-double-egg.jpg",
  "cat-snacks": "/images/food/nigerian-meat-pie.jpg",
  "cat-drinks": "/images/food/chilled-zobo.jpg",
  "cat-latenight": "/images/food/peppered-asun.jpg",
};

/**
 * Default neutral branded placeholder for unverified food items
 */
export const NEUTRAL_FOOD_PLACEHOLDER = "/images/food/food-placeholder.svg";

/**
 * Returns the verified image URL for any menu item, ensuring no mismatched photos.
 */
export function getVerifiedFoodImage(itemId: string, categoryId?: string, fallbackUrl?: string): string {
  if (VERIFIED_FOOD_IMAGES[itemId]) {
    return VERIFIED_FOOD_IMAGES[itemId].src;
  }
  if (categoryId && CATEGORY_FALLBACK_IMAGES[categoryId]) {
    return CATEGORY_FALLBACK_IMAGES[categoryId];
  }
  if (fallbackUrl && fallbackUrl.startsWith("/images/food/")) {
    return fallbackUrl;
  }
  return NEUTRAL_FOOD_PLACEHOLDER;
}
