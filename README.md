# MISE Campus

> **Your campus. Your cravings. Your budget.**

MISE Campus is an AI-powered campus food discovery and ordering platform designed specifically for universities and tertiary institutions in Nigeria. It bridges the gap between campus food vendors, student pockets, lecture timetables, and physical cafeteria locations across halls of residence.

---

## 1. Product Overview & Problem Statement

In Nigerian tertiary institutions, students face distinct culinary realities:
1. **Unpredictable Cafeteria Pricing:** Food prices fluctuate, forcing students to wander across halls or queue blindly.
2. **Strict Pocket Budgets:** Students operate on tight allowances (e.g., ₦800, ₦1,200, ₦1,500), where even a ₦200 difference determines whether a meal is affordable.
3. **Short Lecture Breaks:** Students often have only 15–30 minutes between lectures at lecture theatres (such as UI Large Lecture Theatres) to walk, queue, eat, and return.
4. **Scattered Vendors:** Food spots are spread across Student Union Buildings (SUB), halls of residence (Tedder, Mellanby, Queen Idia, Kuti), and faculty basements.

MISE Campus answers five fundamental student questions:
1. **What can I eat on my campus today?**
2. **What can I afford with my current budget in Naira?**
3. **Which food vendors are closest to my lecture theatre or hall?**
4. **Which meals match my taste and dietary preferences?**
5. **How can I order food or arrange pickup without wasting time in long queues?**

---

## 2. Key Differentiators

- **100% Grounded AI Recommendations:** The AI assistant never hallucinates dishes, ingredients, or prices. It pre-filters database records against the student's exact budget in Naira and only evaluates available catalog items.
- **Student Pocket Money Mode:** An interactive budget tool that filters meals under exact monetary ceilings (₦500, ₦1,000, ₦1,500, custom amounts) and calculates change and smart combo pairs.
- **Zero-Queue Token Pickup:** When an order is placed, a unique student pickup token code (e.g. `UI-824`) is generated. The kitchen begins preparation immediately, and the student simply walks up to the counter and presents the token.
- **Multi-Institution Architecture:** Cleanly isolates institutions (University of Ibadan, Obafemi Awolowo University, University of Lagos) with campus-specific hall quadrangles and cafeteria directories.
- **Vendor Kitchen Console:** Cafeteria managers can toggle item availability in one click, update live prices, and advance incoming orders through a real-time status board.

---

## 3. Visual Identity & Editorial Design

- **Warm Background:** `#F6F3EC`
- **Primary Text:** `#24251F`
- **Fresh Accent:** `#D7E7A5`
- **Warm Neutral:** `#E8D5C0`
- **Pepper Accent:** `#A84C35`
- **Surface White:** `#FFFFFF`
- **Typography:** Refined typography with Plus Jakarta Sans and editorial headings.
- **Restrained Shadows & High-Quality Visuals:** Clean paper aesthetics, mobile-first responsive grid, and zero flashy generic templates.

---

## 4. Technology Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript 5 (Strict type checking)
- **Styling:** Tailwind CSS v4 with custom editorial design tokens
- **Icons:** `lucide-react`
- **Validation:** `zod` for request schemas, order payloads, and AI structured output
- **AI Integration:** OpenRouter API (`google/gemini-2.5-flash` or custom models) with automatic deterministic fallback
- **Database:** Supabase PostgreSQL with complete Row Level Security (RLS) policies

---

## 5. Application Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── food/recommend/route.ts  # Grounded AI meal recommendation endpoint
│   │   └── orders/route.ts          # Server-side order calculation & price validation
│   ├── ai-finder/page.tsx           # Signature AI assistant with lecture break constraints
│   ├── budget/page.tsx              # Interactive student budget mode with combo suggestions
│   ├── discover/page.tsx            # Full campus food discovery hub (dishes & cafeterias)
│   ├── vendor/[id]/page.tsx         # Detailed cafeteria profiles with verified menus
│   ├── vendor-portal/page.tsx       # Vendor management dashboard for kitchen operators
│   ├── my-campus/page.tsx           # Personalized student dashboard (orders, favorites)
│   ├── orders/[id]/page.tsx         # Live order tracker with student pickup tokens
│   ├── admin/page.tsx               # Platform administration and moderation controls
│   ├── globals.css                  # Design tokens and styling utilities
│   ├── layout.tsx                   # Root layout with fonts & Providers
│   └── page.tsx                     # Landing page with hero, search, & featured items
├── components/
│   ├── campus/                      # School selector modal
│   ├── cart/                        # Slide-over cart drawer with checkout
│   ├── food/                        # FoodCard component with variants modal
│   ├── home/                        # Hero, featured sections, and how-it-works
│   ├── layout/                      # Navbar and footer
│   └── vendor/                      # VendorCard component
├── context/
│   └── CampusContext.tsx            # Multi-school state, cart, orders, and role switching
├── lib/
│   ├── ai/recommendationService.ts  # Zod schema validation & OpenRouter integration
│   └── data/mockData.ts             # Authentic dataset for University of Ibadan (flagship)
└── types/
    └── campus.ts                    # TypeScript domain definitions
```

---

## 6. Environment Variables

Create a `.env.local` file in the project root:

```bash
# OpenRouter AI (Optional for AI Food Finder)
# If omitted, the app automatically switches to the verified deterministic catalog engine
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemini-2.5-flash

# Supabase (Optional for local development; mock data is used by default)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 7. Database Migrations (Supabase)

The complete SQL schema with Row Level Security (RLS) policies is located at:
[`supabase/migrations/20261010_initial_schema.sql`](supabase/migrations/20261010_initial_schema.sql)

To deploy to Supabase:
1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor**.
3. Paste the contents of `supabase/migrations/20261010_initial_schema.sql`.
4. Click **Run**.

---

## 8. Running the Application Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open your browser
http://localhost:3000
```

---

## 9. Running Automated Tests

Run the test suite verifying multi-school filtering, budget constraints, Zod schema validation, and price calculations:

```bash
npx tsx src/tests/validate-campus.ts
```

All 7 core test suites pass with zero errors.

---

## 10. Role Switching & Demo Mode

The application includes an instant role toggle in the top-right navigation bar:
- **Student Mode:** Browse cafeterias, consult the AI Food Finder, add meals to your tray, and track orders with pickup tokens (`UI-xxx`).
- **Vendor Mode:** Access the **Vendor Portal**, toggle item availability (Available vs. Sold Out), edit dish prices in real time, and advance orders from *Pending* to *Ready for Pickup*.
- **Admin Mode:** Access the **Admin Dashboard** to review vendor applications and audit menu prices.

---

## 11. Disclaimer

MISE Campus is an independent campus food discovery and budget technology platform. It is not officially affiliated with or endorsed by tertiary institution administrations unless explicitly indicated. All vendor names, prices, and locations are verified directly with respective cafeteria operators.
