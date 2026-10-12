import { z } from "zod";
import { MenuItem, RecommendationItem, RecommendationResponse, Vendor } from "@/types/campus";
import { MENU_ITEMS, VENDORS, INSTITUTIONS } from "@/lib/data/mockData";

// Input validation schema
export const recommendationRequestSchema = z.object({
  institutionId: z.string().min(1, "Institution ID is required"),
  budget: z.number().positive("Budget must be a positive number"),
  query: z.string().optional(),
  category: z.string().optional(),
  campusAreaId: z.string().optional(),
  maxWaitMinutes: z.number().positive().optional(),
  dietaryTags: z.array(z.string()).optional(),
});

export type RecommendationRequestInput = z.infer<typeof recommendationRequestSchema>;

// Output validation schema for AI responses
export const aiRecommendationItemSchema = z.object({
  menuItemId: z.string(),
  matchReason: z.string().min(5),
  confidenceScore: z.number().min(0).max(100),
});

export const aiRecommendationResponseSchema = z.object({
  aiExplanation: z.string(),
  recommendedItemIds: z.array(aiRecommendationItemSchema),
});

/**
 * Deterministic Filter & Grounding Engine
 * Guarantees that only real, available menu items strictly within the student's budget are considered.
 */
export function filterEligibleMenuItems(
  institutionId: string,
  budget: number,
  items: MenuItem[] = MENU_ITEMS,
  vendors: Vendor[] = VENDORS,
  options?: {
    category?: string;
    campusAreaId?: string;
    maxWaitMinutes?: number;
  }
): { eligibleItems: MenuItem[]; eligibleVendors: Map<string, Vendor> } {
  const vendorMap = new Map<string, Vendor>();
  vendors.forEach((v) => vendorMap.set(v.id, v));

  const eligibleItems = items.filter((item) => {
    // 1. Institution check
    if (item.institutionId !== institutionId) return false;

    // 2. Strict Budget Check: Price must NOT exceed student budget
    if (item.price > budget) return false;

    // 3. Availability check
    if (!item.isAvailable) return false;

    // 4. Optional category filter
    if (options?.category && options.category !== "All") {
      if (item.categoryName.toLowerCase() !== options.category.toLowerCase()) {
        return false;
      }
    }

    // 5. Optional max prep time filter (between lectures)
    if (options?.maxWaitMinutes && item.prepTimeMinutes > options.maxWaitMinutes) {
      return false;
    }

    // 6. Optional campus area filter
    if (options?.campusAreaId && options.campusAreaId !== "all") {
      const v = vendorMap.get(item.vendorId);
      if (v && v.campusAreaId !== options.campusAreaId) {
        return false;
      }
    }

    return true;
  });

  return { eligibleItems, eligibleVendors: vendorMap };
}

/**
 * Intelligent Deterministic Recommendation Fallback
 * Used when OpenRouter API key is not provided or offline.
 */
export function generateDeterministicRecommendations(
  input: RecommendationRequestInput,
  items: MenuItem[] = MENU_ITEMS,
  vendors: Vendor[] = VENDORS
): RecommendationResponse {
  const institution = INSTITUTIONS.find((i) => i.id === input.institutionId) || INSTITUTIONS[0];
  const { eligibleItems, eligibleVendors } = filterEligibleMenuItems(
    input.institutionId,
    input.budget,
    items,
    vendors,
    {
      category: input.category,
      campusAreaId: input.campusAreaId,
      maxWaitMinutes: input.maxWaitMinutes,
    }
  );

  const queryLower = (input.query || "").toLowerCase();

  // Score each item based on query keyword matching, budget efficiency, popularity, and prep time
  const scored = eligibleItems.map((item) => {
    const vendor = eligibleVendors.get(item.vendorId);
    let score = 50;

    // Query relevance
    if (queryLower) {
      if (item.name.toLowerCase().includes(queryLower)) score += 30;
      if (item.description.toLowerCase().includes(queryLower)) score += 15;
      if (item.categoryName.toLowerCase().includes(queryLower)) score += 20;
      if (item.tags.some((t) => t.toLowerCase().includes(queryLower))) score += 20;
    }

    // Budget utilization: rewards getting good value without exceeding
    const budgetRatio = item.price / input.budget;
    if (budgetRatio >= 0.5 && budgetRatio <= 0.95) score += 15; // sweet spot

    // Quick prep bonus if in a rush
    if (input.maxWaitMinutes && item.prepTimeMinutes <= 5) score += 15;
    if (item.isPopular) score += 10;

    let matchReason = `Priced at ₦${item.price.toLocaleString()} (within your ₦${input.budget.toLocaleString()} budget)`;
    if (item.prepTimeMinutes <= 6) {
      matchReason += ` and quick to assemble (${item.prepTimeMinutes} mins) for fast campus pickup.`;
    } else {
      matchReason += ` offering a hearty, filling portion at ${vendor?.name || "campus cafeteria"}.`;
    }

    if (queryLower && item.name.toLowerCase().includes(queryLower)) {
      matchReason = `Direct match for "${input.query}": ${matchReason}`;
    }

    const recItem: RecommendationItem = {
      menuItemId: item.id,
      vendorId: item.vendorId,
      dishName: item.name,
      vendorName: vendor ? vendor.name : "Campus Vendor",
      campusArea: vendor ? vendor.campusAreaName : "Campus Central",
      listedPrice: item.price,
      portionSize: item.portionSize,
      prepTimeMinutes: item.prepTimeMinutes,
      matchReason,
      confidenceScore: Math.min(score, 98),
      isAvailable: item.isAvailable,
    };

    return recItem;
  });

  // Sort descending by score
  scored.sort((a, b) => b.confidenceScore - a.confidenceScore);
  const topRecommendations = scored.slice(0, 5);

  const count = topRecommendations.length;
  let aiExplanation = "";
  if (count === 0) {
    aiExplanation = `No verified meals found under ₦${input.budget.toLocaleString()} at ${institution.name} matching your exact filters. Try broadening your budget or adjusting your campus hall location.`;
  } else {
    aiExplanation = `Found ${count} verified cafeteria dishes at ${institution.name} within your ₦${input.budget.toLocaleString()} student budget. All prices and locations are grounded in live vendor menu cards.`;
  }

  return {
    query: input.query || `Budget ₦${input.budget.toLocaleString()}`,
    institutionName: institution.name,
    budget: input.budget,
    count,
    recommendations: topRecommendations,
    aiExplanation,
    source: "deterministic_verified_catalog",
  };
}

/**
 * Execute AI-Powered Recommendations via OpenRouter with Guaranteed Grounding
 */
export async function getCampusFoodRecommendations(
  input: RecommendationRequestInput,
  items: MenuItem[] = MENU_ITEMS,
  vendors: Vendor[] = VENDORS
): Promise<RecommendationResponse> {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const institution = INSTITUTIONS.find((i) => i.id === input.institutionId) || INSTITUTIONS[0];

  // 1. Strictly filter catalog before calling AI
  const { eligibleItems, eligibleVendors } = filterEligibleMenuItems(
    input.institutionId,
    input.budget,
    items,
    vendors,
    {
      category: input.category,
      campusAreaId: input.campusAreaId,
      maxWaitMinutes: input.maxWaitMinutes,
    }
  );

  // If no items match budget, immediately return grounded response without wasting AI tokens
  if (eligibleItems.length === 0) {
    return {
      query: input.query || `Budget ₦${input.budget.toLocaleString()}`,
      institutionName: institution.name,
      budget: input.budget,
      count: 0,
      recommendations: [],
      aiExplanation: `No verified cafeteria meals were found for ₦${input.budget.toLocaleString()} or less at ${institution.name}. University cafeteria meals typically start from ₦400 - ₦900. Please increase your budget filter to see available options.`,
      source: "deterministic_verified_catalog",
    };
  }

  // If no API key is provided, use our verified deterministic catalog engine
  if (!openRouterApiKey) {
    return generateDeterministicRecommendations(input, items, vendors);
  }

  // 2. Format grounding context for OpenRouter
  const candidateList = eligibleItems.map((item) => {
    const v = eligibleVendors.get(item.vendorId);
    return {
      id: item.id,
      name: item.name,
      vendor: v?.name || "Campus Vendor",
      area: v?.campusAreaName || "Campus",
      price_naira: item.price,
      portion: item.portionSize,
      prep_mins: item.prepTimeMinutes,
      category: item.categoryName,
      tags: item.tags,
      description: item.description,
    };
  });

  const systemPrompt = `You are MISE Campus AI, a trusted food discovery assistant for Nigerian university students at ${institution.name}.
CRITICAL CONSTRAINTS:
1. You MUST ONLY recommend dishes from the provided CANDIDATE LIST.
2. DO NOT invent dish names, vendors, ingredients, or prices.
3. Every recommendation MUST reference an exact "menuItemId" from the CANDIDATE LIST.
4. Output MUST be valid JSON conforming to the requested schema.
5. Provide a warm, practical, student-friendly explanation tailored to Nigerian campus life.`;

  const userPrompt = `Student Request:
- Campus: ${institution.name}
- Available Budget: ₦${input.budget.toLocaleString()}
- Query/Craving: "${input.query || "Looking for a good meal"}"
- Category: ${input.category || "Any"}
- Max Prep/Wait Time: ${input.maxWaitMinutes ? `${input.maxWaitMinutes} mins` : "Flexible"}

CANDIDATE LIST (Pre-filtered by student budget <= ₦${input.budget}):
${JSON.stringify(candidateList, null, 2)}

Return a JSON object with:
{
  "aiExplanation": "Brief 1-2 sentence overview explaining why these options best fit the student's budget and schedule",
  "recommendedItemIds": [
    {
      "menuItemId": "exact id from candidate list",
      "matchReason": "1 sentence explanation why this fits their craving and budget",
      "confidenceScore": 95
    }
  ]
}
Select the top 1 to 4 best matching items.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": "https://mise-campus.vercel.app",
        "X-Title": "MISE Campus",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      console.warn("OpenRouter API returned error, falling back to deterministic engine:", response.statusText);
      return generateDeterministicRecommendations(input, items, vendors);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) {
      return generateDeterministicRecommendations(input, items, vendors);
    }

    const parsed = aiRecommendationResponseSchema.safeParse(JSON.parse(rawContent));
    if (!parsed.success) {
      console.warn("AI output validation failed, falling back to deterministic engine:", parsed.error);
      return generateDeterministicRecommendations(input, items, vendors);
    }

    // Map AI selected items back to verified records
    const finalRecs: RecommendationItem[] = [];
    for (const rec of parsed.data.recommendedItemIds) {
      const realItem = eligibleItems.find((i) => i.id === rec.menuItemId);
      if (realItem) {
        const vendor = eligibleVendors.get(realItem.vendorId);
        finalRecs.push({
          menuItemId: realItem.id,
          vendorId: realItem.vendorId,
          dishName: realItem.name,
          vendorName: vendor ? vendor.name : "Campus Vendor",
          campusArea: vendor ? vendor.campusAreaName : "Campus Central",
          listedPrice: realItem.price,
          portionSize: realItem.portionSize,
          prepTimeMinutes: realItem.prepTimeMinutes,
          matchReason: rec.matchReason,
          confidenceScore: rec.confidenceScore,
          isAvailable: realItem.isAvailable,
        });
      }
    }

    if (finalRecs.length === 0) {
      return generateDeterministicRecommendations(input, items, vendors);
    }

    return {
      query: input.query || `Budget ₦${input.budget.toLocaleString()}`,
      institutionName: institution.name,
      budget: input.budget,
      count: finalRecs.length,
      recommendations: finalRecs,
      aiExplanation: parsed.data.aiExplanation,
      source: "openrouter_ai",
    };
  } catch (error) {
    console.error("OpenRouter request failed:", error);
    return generateDeterministicRecommendations(input, items, vendors);
  }
}
