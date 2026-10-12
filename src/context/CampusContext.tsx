"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CartItem,
  Institution,
  MenuItem,
  Order,
  OrderStatus,
  Vendor,
} from "@/types/campus";
import { INSTITUTIONS, MENU_ITEMS, VENDORS } from "@/lib/data/mockData";

interface CampusContextType {
  // Institution
  selectedInstitution: Institution;
  setSelectedInstitution: (inst: Institution) => void;
  institutions: Institution[];

  // Vendors & Items (can be updated dynamically in vendor portal)
  vendors: Vendor[];
  menuItems: MenuItem[];
  updateMenuItemAvailability: (itemId: string, isAvailable: boolean) => void;
  updateMenuItemPrice: (itemId: string, newPrice: number) => void;
  addMenuItem: (item: Omit<MenuItem, "id">) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    vendor: Vendor,
    quantity?: number,
    selectedVariants?: { name: string; priceDelta: number }[]
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    studentName: string;
    studentPhone: string;
    studentEmail?: string;
    paymentMethod: "cash_on_pickup" | "transfer_on_pickup";
    pickupOption: "counter_pickup" | "hall_dropoff";
    deliveryLocation?: string;
    specialInstructions?: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Favorites
  savedVendorIds: string[];
  toggleSavedVendor: (vendorId: string) => void;
  savedMealIds: string[];
  toggleSavedMeal: (mealId: string) => void;

  // Active Role switcher (for testing student, vendor, admin)
  activeRole: "student" | "vendor" | "admin";
  setActiveRole: (role: "student" | "vendor" | "admin") => void;
  activeVendorId: string;
  setActiveVendorId: (vendorId: string) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedInstitution, setSelectedInstitutionState] =
    useState<Institution>(INSTITUTIONS[0]); // Default: University of Ibadan
  const [vendors] = useState<Vendor[]>(VENDORS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [savedVendorIds, setSavedVendorIds] = useState<string[]>([
    "vendor-mama-t",
    "vendor-tedder-grill",
  ]);
  const [savedMealIds, setSavedMealIds] = useState<string[]>([
    "item-amala-abula-classic",
    "item-tedder-jollof-chicken",
  ]);
  const [activeRole, setActiveRole] = useState<"student" | "vendor" | "admin">(
    "student"
  );
  const [activeVendorId, setActiveVendorId] = useState<string>("vendor-mama-t");

  // Sample initial order so students can see an active order tracking experience right away
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ord-ui-101",
      orderNumber: "ORD-94821",
      tokenCode: "UI-824",
      studentName: "Tunde Bakare",
      studentPhone: "0803 456 7890",
      institutionId: "inst-ui",
      institutionName: "University of Ibadan",
      vendorId: "vendor-mama-t",
      vendorName: "Buka Royale (Mama T's Kitchen)",
      campusAreaName: "Student Union Building (SUB)",
      items: [
        {
          menuItemId: "item-amala-abula-classic",
          name: "Classic Amala & Abula (Gbegiri + Ewedu)",
          price: 900,
          quantity: 1,
          selectedVariants: [{ name: "Add Spicy Goat Meat (Ogunfe)", priceDelta: 600 }],
          itemTotal: 1500,
        },
      ],
      subtotal: 1500,
      containerFee: 100,
      deliveryFee: 0,
      totalAmount: 1600,
      status: "ready_for_pickup",
      paymentMethod: "cash_on_pickup",
      pickupOption: "counter_pickup",
      createdAt: "2026-10-10T12:30:00.000Z",
      estimatedPickupTime: "Ready now at SUB Counter",
      specialInstructions: "Extra pepper please",
    },
  ]);

  // Sync from localStorage on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedInst = localStorage.getItem("mise_campus_selected_inst");
        if (savedInst) {
          const found = INSTITUTIONS.find((i) => i.id === savedInst);
          if (found) setSelectedInstitutionState(found);
        }
        const savedCartData = localStorage.getItem("mise_campus_cart");
        if (savedCartData) setCart(JSON.parse(savedCartData));

        const savedOrdersData = localStorage.getItem("mise_campus_orders");
        if (savedOrdersData) setOrders(JSON.parse(savedOrdersData));

        const savedFavVendors = localStorage.getItem("mise_campus_saved_vendors");
        if (savedFavVendors) setSavedVendorIds(JSON.parse(savedFavVendors));

        const savedFavMeals = localStorage.getItem("mise_campus_saved_meals");
        if (savedFavMeals) setSavedMealIds(JSON.parse(savedFavMeals));
      } catch {
        // LocalStorage access fallback
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setSelectedInstitution = (inst: Institution) => {
    setSelectedInstitutionState(inst);
    try {
      localStorage.setItem("mise_campus_selected_inst", inst.id);
    } catch {
      // Ignore
    }
  };

  const addToCart = (
    item: MenuItem,
    vendor: Vendor,
    quantity = 1,
    selectedVariants: { name: string; priceDelta: number }[] = []
  ) => {
    setCart((prev) => {
      const variantKey = selectedVariants.map((v) => v.name).sort().join("|");
      const cartItemId = `${item.id}-${variantKey}`;
      const deltaTotal = selectedVariants.reduce((sum, v) => sum + v.priceDelta, 0);
      const unitPrice = item.price + deltaTotal;

      const existingIndex = prev.findIndex((c) => c.id === cartItemId);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice,
        };
      } else {
        const newCartItem: CartItem = {
          id: cartItemId,
          menuItemId: item.id,
          vendorId: vendor.id,
          vendorName: vendor.name,
          campusAreaName: vendor.campusAreaName,
          name: item.name,
          price: unitPrice,
          quantity,
          selectedVariants,
          itemTotal: unitPrice * quantity,
          portionSize: item.portionSize,
        };
        updated = [...prev, newCartItem];
      }
      try {
        localStorage.setItem("mise_campus_cart", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== cartItemId);
      try {
        localStorage.setItem("mise_campus_cart", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemTotal: item.price * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      try {
        localStorage.setItem("mise_campus_cart", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("mise_campus_cart");
    } catch {
      // Ignore
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.itemTotal, 0);
  const cartItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const createOrder = (orderData: {
    studentName: string;
    studentPhone: string;
    studentEmail?: string;
    paymentMethod: "cash_on_pickup" | "transfer_on_pickup";
    pickupOption: "counter_pickup" | "hall_dropoff";
    deliveryLocation?: string;
    specialInstructions?: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    // We take the vendor of the first cart item
    const firstItem = cart[0];
    const vendor = vendors.find((v) => v.id === firstItem.vendorId) || VENDORS[0];
    const subtotal = cartTotal;
    const containerFee = 100;
    const deliveryFee =
      orderData.pickupOption === "hall_dropoff" ? vendor.deliveryFee || 200 : 0;
    const totalAmount = subtotal + containerFee + deliveryFee;

    const tokenRandom = Math.floor(100 + Math.random() * 900);
    const tokenCode = `${selectedInstitution.shortName}-${tokenRandom}`;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      tokenCode,
      studentName: orderData.studentName,
      studentPhone: orderData.studentPhone,
      studentEmail: orderData.studentEmail,
      institutionId: selectedInstitution.id,
      institutionName: selectedInstitution.name,
      vendorId: vendor.id,
      vendorName: vendor.name,
      campusAreaName: vendor.campusAreaName,
      items: cart.map((c) => ({
        menuItemId: c.menuItemId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        selectedVariants: c.selectedVariants,
        itemTotal: c.itemTotal,
      })),
      subtotal,
      containerFee,
      deliveryFee,
      totalAmount,
      status: "pending",
      paymentMethod: orderData.paymentMethod,
      pickupOption: orderData.pickupOption,
      deliveryLocation: orderData.deliveryLocation,
      specialInstructions: orderData.specialInstructions,
      createdAt: new Date().toISOString(),
      estimatedPickupTime: "12-15 mins from confirmation",
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem("mise_campus_orders", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => {
      const updated = prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord
      );
      try {
        localStorage.setItem("mise_campus_orders", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const updateMenuItemAvailability = (itemId: string, isAvailable: boolean) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isAvailable,
              lastVerifiedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const updateMenuItemPrice = (itemId: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              price: newPrice,
              lastVerifiedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const toggleSavedVendor = (vendorId: string) => {
    setSavedVendorIds((prev) => {
      const exists = prev.includes(vendorId);
      const updated = exists
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId];
      try {
        localStorage.setItem("mise_campus_saved_vendors", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const toggleSavedMeal = (mealId: string) => {
    setSavedMealIds((prev) => {
      const exists = prev.includes(mealId);
      const updated = exists
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId];
      try {
        localStorage.setItem("mise_campus_saved_meals", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  return (
    <CampusContext.Provider
      value={{
        selectedInstitution,
        setSelectedInstitution,
        institutions: INSTITUTIONS,
        vendors,
        menuItems,
        updateMenuItemAvailability,
        updateMenuItemPrice,
        addMenuItem,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        savedVendorIds,
        toggleSavedVendor,
        savedMealIds,
        toggleSavedMeal,
        activeRole,
        setActiveRole,
        activeVendorId,
        setActiveVendorId,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error("useCampus must be used within a CampusProvider");
  }
  return context;
};
