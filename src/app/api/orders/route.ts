import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MENU_ITEMS, VENDORS, INSTITUTIONS } from "@/lib/data/mockData";

const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().positive(),
  selectedVariants: z.array(
    z.object({
      name: z.string(),
      priceDelta: z.number(),
    })
  ).optional(),
});

const createOrderSchema = z.object({
  institutionId: z.string(),
  studentName: z.string().min(2),
  studentPhone: z.string().min(8),
  studentEmail: z.string().email().optional(),
  pickupOption: z.enum(["counter_pickup", "hall_dropoff"]),
  paymentMethod: z.enum(["cash_on_pickup", "transfer_on_pickup"]),
  deliveryLocation: z.string().optional(),
  specialInstructions: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Order validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      institutionId,
      studentName,
      studentPhone,
      studentEmail,
      pickupOption,
      paymentMethod,
      deliveryLocation,
      specialInstructions,
      items,
    } = validation.data;

    // Verify institution
    const institution = INSTITUTIONS.find((i) => i.id === institutionId);
    if (!institution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    // Build trusted catalog calculation
    let calculatedSubtotal = 0;
    const validatedItems = [];
    let vendorId = "";

    for (const requestedItem of items) {
      const dbItem = MENU_ITEMS.find((m) => m.id === requestedItem.menuItemId);
      if (!dbItem) {
        return NextResponse.json(
          { error: `Menu item ${requestedItem.menuItemId} does not exist.` },
          { status: 400 }
        );
      }

      if (!dbItem.isAvailable) {
        return NextResponse.json(
          { error: `Dish "${dbItem.name}" is currently sold out.` },
          { status: 400 }
        );
      }

      if (!vendorId) {
        vendorId = dbItem.vendorId;
      } else if (vendorId !== dbItem.vendorId) {
        return NextResponse.json(
          { error: "Cart items must belong to the same campus cafeteria for a single pickup token." },
          { status: 400 }
        );
      }

      // Calculate unit price from database record + validated variants
      const variantsDelta = (requestedItem.selectedVariants || []).reduce(
        (sum, v) => sum + v.priceDelta,
        0
      );
      const unitPrice = dbItem.price + variantsDelta;
      const itemTotal = unitPrice * requestedItem.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        menuItemId: dbItem.id,
        name: dbItem.name,
        price: unitPrice,
        quantity: requestedItem.quantity,
        selectedVariants: requestedItem.selectedVariants,
        itemTotal,
      });
    }

    const vendor = VENDORS.find((v) => v.id === vendorId) || VENDORS[0];

    const containerFee = 100; // Fixed ₦100 takeaway container fee
    const deliveryFee = pickupOption === "hall_dropoff" ? vendor.deliveryFee || 200 : 0;
    const totalAmount = calculatedSubtotal + containerFee + deliveryFee;

    const tokenRandom = Math.floor(100 + Math.random() * 900);
    const tokenCode = `${institution.shortName}-${tokenRandom}`;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const orderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber,
      tokenCode,
      studentName,
      studentPhone,
      studentEmail,
      institutionId: institution.id,
      institutionName: institution.name,
      vendorId: vendor.id,
      vendorName: vendor.name,
      campusAreaName: vendor.campusAreaName,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      containerFee,
      deliveryFee,
      totalAmount,
      status: "pending",
      paymentMethod,
      pickupOption,
      deliveryLocation,
      specialInstructions,
      createdAt: new Date().toISOString(),
      estimatedPickupTime: "12-15 mins from confirmation",
    };

    return NextResponse.json(orderRecord, { status: 201 });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json(
      { error: "Internal server error calculating order" },
      { status: 500 }
    );
  }
}
