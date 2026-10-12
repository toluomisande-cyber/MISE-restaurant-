import { NextRequest, NextResponse } from "next/server";
import {
  getCampusFoodRecommendations,
  recommendationRequestSchema,
} from "@/lib/ai/recommendationService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate payload with Zod
    const validationResult = recommendationRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const recommendations = await getCampusFoodRecommendations(
      validationResult.data
    );

    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error("Error in /api/food/recommend:", error);
    return NextResponse.json(
      {
        error: "Internal server error processing recommendation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
