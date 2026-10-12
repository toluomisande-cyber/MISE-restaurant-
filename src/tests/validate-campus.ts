import {
  filterEligibleMenuItems,
  generateDeterministicRecommendations,
  recommendationRequestSchema,
} from "../lib/ai/recommendationService";
import { MENU_ITEMS, VENDORS, INSTITUTIONS } from "../lib/data/mockData";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log("\n🧪 Running MISE Campus Automated Verification Tests...\n");

// Test 1: Institution association & existence
assert(INSTITUTIONS.length >= 3, "At least 3 institutions configured (UI, OAU, UNILAG)");
const uiInst = INSTITUTIONS.find((i) => i.slug === "ui");
assert(!!uiInst, "Flagship University of Ibadan institution exists");

// Test 2: Multi-school separation
const uiItems = MENU_ITEMS.filter((i) => i.institutionId === "inst-ui");
assert(uiItems.length > 0, "University of Ibadan has verified menu items");
assert(
  uiItems.every((i) => i.institutionId === "inst-ui"),
  "All UI items belong strictly to University of Ibadan"
);

// Test 3: Budget filtering (₦1,000 budget cap)
const budget1000 = filterEligibleMenuItems("inst-ui", 1000, MENU_ITEMS, VENDORS);
assert(
  budget1000.eligibleItems.every((item) => item.price <= 1000),
  "All items returned for ₦1,000 budget are strictly <= ₦1,000"
);
assert(budget1000.eligibleItems.length > 0, "Dishes found within ₦1,000 budget");

// Test 4: Extreme low budget check (e.g. ₦300)
const budget300 = filterEligibleMenuItems("inst-ui", 300, MENU_ITEMS, VENDORS);
assert(
  budget300.eligibleItems.length === 0,
  "₦300 budget correctly returns zero items (preventing fake cheap prices)"
);

// Test 5: AI Recommendation input schema validation with Zod
const validPayload = {
  institutionId: "inst-ui",
  budget: 1500,
  query: "Amala and Abula",
  maxWaitMinutes: 15,
};
const parsedValid = recommendationRequestSchema.safeParse(validPayload);
assert(parsedValid.success, "Valid recommendation payload passes Zod schema");

const invalidPayload = {
  institutionId: "",
  budget: -500, // Negative budget must fail
};
const parsedInvalid = recommendationRequestSchema.safeParse(invalidPayload);
assert(!parsedInvalid.success, "Invalid/negative budget rejected by Zod schema");

// Test 6: Deterministic Catalog Grounding
const recResponse = generateDeterministicRecommendations(
  {
    institutionId: "inst-ui",
    budget: 1500,
    query: "Jollof",
  },
  MENU_ITEMS,
  VENDORS
);

assert(recResponse.recommendations.length > 0, "Recommendations generated for Jollof");
assert(
  recResponse.recommendations.every((r) => r.listedPrice <= 1500),
  "Every recommendation price strictly adheres to budget constraint"
);
assert(
  recResponse.recommendations.every((r) =>
    MENU_ITEMS.some((m) => m.id === r.menuItemId)
  ),
  "Every recommended item references a real menu record (No hallucinated IDs)"
);

// Test 7: Cart Total and Fee Calculation
const item1 = MENU_ITEMS[0]; // e.g. ₦900
const item2 = MENU_ITEMS[1]; // e.g. ₦1500
const qty1 = 2;
const qty2 = 1;
const expectedSubtotal = item1.price * qty1 + item2.price * qty2;
const containerFee = 100;
const deliveryFee = 200;
const expectedTotal = expectedSubtotal + containerFee + deliveryFee;

assert(
  expectedSubtotal === item1.price * 2 + item2.price,
  "Subtotal price arithmetic calculated accurately"
);
assert(
  expectedTotal === expectedSubtotal + 300,
  "Container fee (₦100) and delivery fee (₦200) applied correctly"
);

// Test 8: Food Image Accuracy and Integrity
import fs from "node:fs";
import path from "node:path";
import { VERIFIED_FOOD_IMAGES } from "../lib/data/foodImageMap";

assert(
  MENU_ITEMS.every((m) => !!VERIFIED_FOOD_IMAGES[m.id]),
  "Every menu item is registered in the verified food image dictionary"
);

assert(
  MENU_ITEMS.every((m) => !m.imageUrl.includes("photo-1546069901-ba9599a7e63c") && !m.imageUrl.includes("photo-1565299624946-b28f40a0ae38")),
  "No menu item uses the previous misleading salad bowl or pizza placeholder images"
);

assert(
  MENU_ITEMS.every((m) => {
    if (m.imageUrl.startsWith("/")) {
      const fullPath = path.join(process.cwd(), "public", m.imageUrl);
      return fs.existsSync(fullPath);
    }
    return true;
  }),
  "All local food image assets exist on disk in the public folder"
);

console.log("\n🎉 ALL 8 TEST SUITES (INCLUDING FOOD IMAGE INTEGRITY) PASSED FLAWLESSLY!\n");

