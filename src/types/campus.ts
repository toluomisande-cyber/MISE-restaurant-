export type InstitutionSlug = "ui" | "oau" | "unilag" | "covenant";

export interface CampusArea {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  description: string;
  popularSpots: string[];
}

export interface Institution {
  id: string;
  slug: InstitutionSlug;
  name: string;
  shortName: string;
  city: string;
  state: string;
  country: string;
  description: string;
  campusAreas: CampusArea[];
  activeVendorsCount: number;
  logoText: string;
}

export type FoodCategory =
  | "Swallow & Soups"
  | "Rice & Grains"
  | "Beans & Porridge"
  | "Pasta & Grills"
  | "Snacks & Pastries"
  | "Drinks & Parfait"
  | "Late Night Bites";

export interface MenuCategory {
  id: string;
  name: FoodCategory;
  slug: string;
  icon: string;
  description: string;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  priceDelta: number; // e.g., +200 for extra beef
  isAvailable: boolean;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  institutionId: string;
  categoryId: string;
  categoryName: FoodCategory;
  name: string;
  description: string;
  price: number; // in Naira (₦)
  currency: string; // 'NGN'
  portionSize: string; // e.g. 'Standard plate', 'Double scoop'
  prepTimeMinutes: number; // estimated time to assemble/cook
  isAvailable: boolean;
  lastVerifiedAt: string; // ISO date string or formatted date
  imageUrl: string;
  tags: string[]; // e.g. ['High Protein', 'Bestseller', 'Student Favorite', 'Spicy']
  variants?: MenuItemVariant[];
  isPopular?: boolean;
}

export interface Vendor {
  id: string;
  institutionId: string;
  campusAreaId: string;
  campusAreaName: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  categories: FoodCategory[];
  rating: number; // genuine demo rating, 1-5
  totalReviews: number;
  priceRange: "₦" | "₦₦" | "₦₦₦";
  openingHours: string; // e.g., '8:00 AM - 7:30 PM'
  isOpenNow: boolean;
  verifiedAddress: string;
  verifiedStatus: "verified_campus_vendor" | "community_listed";
  lastMenuUpdate: string;
  pickupInstructions: string;
  allowsDelivery: boolean;
  deliveryFee?: number;
  contactPhone: string;
  whatsappNumber?: string;
  bannerImage: string;
  logoImage: string;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready_for_pickup"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash_on_pickup" | "transfer_on_pickup";
export type PickupOption = "counter_pickup" | "hall_dropoff";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariants?: { name: string; priceDelta: number }[];
  itemTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  tokenCode: string; // e.g. "UI-8291"
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  institutionId: string;
  institutionName: string;
  vendorId: string;
  vendorName: string;
  campusAreaName: string;
  items: OrderItem[];
  subtotal: number;
  containerFee: number; // ₦100 per order
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  pickupOption: PickupOption;
  deliveryLocation?: string; // e.g. "Tedder Hall, Room B12"
  specialInstructions?: string;
  createdAt: string;
  estimatedPickupTime: string;
}

export interface CartItem {
  id: string; // unique item id + variants string
  menuItemId: string;
  vendorId: string;
  vendorName: string;
  campusAreaName: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariants: { name: string; priceDelta: number }[];
  itemTotal: number;
  portionSize: string;
}

export interface RecommendationRequest {
  institutionId: string;
  budget: number;
  query?: string;
  category?: string;
  campusAreaId?: string;
  maxWaitMinutes?: number;
  dietaryTags?: string[];
}

export interface RecommendationItem {
  menuItemId: string;
  vendorId: string;
  dishName: string;
  vendorName: string;
  campusArea: string;
  listedPrice: number;
  portionSize: string;
  prepTimeMinutes: number;
  matchReason: string;
  confidenceScore: number;
  isAvailable: boolean;
}

export interface RecommendationResponse {
  query: string;
  institutionName: string;
  budget: number;
  count: number;
  recommendations: RecommendationItem[];
  aiExplanation: string;
  source: "openrouter_ai" | "deterministic_verified_catalog";
}
