-- ==============================================================================
-- MISE CAMPUS: Database Schema & Row Level Security (RLS) Migrations
-- Designed for Multi-School Tertiary Food Discovery & Ordering in Nigeria
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. INSTITUTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Nigeria',
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. CAMPUS AREAS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campus_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    popular_spots JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. USER PROFILES
-- ------------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('student', 'vendor', 'admin');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(50),
    role user_role DEFAULT 'student'::user_role NOT NULL,
    primary_institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    campus_area_id UUID REFERENCES public.campus_areas(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. VENDORS (Campus Cafeterias & Food Businesses)
-- ------------------------------------------------------------------------------
CREATE TYPE vendor_status AS ENUM ('pending_verification', 'verified_campus_vendor', 'suspended');

CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    campus_area_id UUID NOT NULL REFERENCES public.campus_areas(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    total_reviews INT DEFAULT 0,
    price_range VARCHAR(10) DEFAULT '₦',
    opening_hours VARCHAR(100),
    is_open_now BOOLEAN DEFAULT TRUE,
    verified_address TEXT NOT NULL,
    verified_status vendor_status DEFAULT 'pending_verification' NOT NULL,
    allows_delivery BOOLEAN DEFAULT FALSE,
    delivery_fee INT DEFAULT 0,
    contact_phone VARCHAR(50) NOT NULL,
    whatsapp_number VARCHAR(50),
    banner_image TEXT,
    logo_image TEXT,
    pickup_instructions TEXT,
    last_menu_update TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. VENDOR MEMBERSHIPS (Multi-tenant authorization)
-- ------------------------------------------------------------------------------
CREATE TYPE vendor_member_role AS ENUM ('owner', 'manager', 'cashier');

CREATE TABLE IF NOT EXISTS public.vendor_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role vendor_member_role DEFAULT 'manager'::vendor_member_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(vendor_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 6. MENU CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    icon VARCHAR(20),
    description TEXT
);

-- ------------------------------------------------------------------------------
-- 7. MENU ITEMS (Dishes & Offerings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    category_name VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price INT NOT NULL, -- Stored in whole Naira (e.g. 1500)
    currency VARCHAR(10) DEFAULT 'NGN' NOT NULL,
    portion_size VARCHAR(100) DEFAULT 'Standard Plate',
    prep_time_minutes INT DEFAULT 5,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    variants JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT FALSE,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. ORDERS & ORDER ITEMS
-- ------------------------------------------------------------------------------
CREATE TYPE order_status AS ENUM (
    'pending',
    'accepted',
    'preparing',
    'ready_for_pickup',
    'completed',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL,
    token_code VARCHAR(20) NOT NULL, -- e.g. "UI-824"
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_name VARCHAR(150) NOT NULL,
    student_phone VARCHAR(50) NOT NULL,
    student_email VARCHAR(255),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    subtotal INT NOT NULL,
    container_fee INT DEFAULT 100 NOT NULL,
    delivery_fee INT DEFAULT 0 NOT NULL,
    total_amount INT NOT NULL,
    status order_status DEFAULT 'pending'::order_status NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash_on_pickup' NOT NULL,
    pickup_option VARCHAR(50) DEFAULT 'counter_pickup' NOT NULL,
    delivery_location TEXT,
    special_instructions TEXT,
    estimated_pickup_time VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    item_name VARCHAR(200) NOT NULL,
    price INT NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    selected_variants JSONB DEFAULT '[]'::jsonb,
    item_total INT NOT NULL
);

-- ------------------------------------------------------------------------------
-- 9. SAVED VENDORS & SAVED MEALS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_vendors (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, vendor_id)
);

CREATE TABLE IF NOT EXISTS public.saved_meals (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, menu_item_id)
);

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS across all tables
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_meals ENABLE ROW LEVEL SECURITY;

-- Institutions & Areas: Readable by all public users
CREATE POLICY "Institutions are publicly readable" ON public.institutions
    FOR SELECT USING (true);

CREATE POLICY "Campus areas are publicly readable" ON public.campus_areas
    FOR SELECT USING (true);

-- Vendors & Menu Items: Readable by all public users
CREATE POLICY "Active vendors are publicly readable" ON public.vendors
    FOR SELECT USING (verified_status != 'suspended');

CREATE POLICY "Menu items are publicly readable" ON public.menu_items
    FOR SELECT USING (true);

-- Vendor Management: Only authorized members can mutate their vendor or items
CREATE POLICY "Vendors editable by members" ON public.vendors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.vendor_memberships
            WHERE vendor_memberships.vendor_id = vendors.id
            AND vendor_memberships.user_id = auth.uid()
        )
    );

CREATE POLICY "Menu items editable by vendor members" ON public.menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.vendor_memberships
            WHERE vendor_memberships.vendor_id = menu_items.vendor_id
            AND vendor_memberships.user_id = auth.uid()
        )
    );

-- Orders: Students see only their own orders; Vendors see orders for their business
CREATE POLICY "Students can view their own orders" ON public.orders
    FOR SELECT USING (
        student_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.vendor_memberships
            WHERE vendor_memberships.vendor_id = orders.vendor_id
            AND vendor_memberships.user_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can update incoming order statuses" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.vendor_memberships
            WHERE vendor_memberships.vendor_id = orders.vendor_id
            AND vendor_memberships.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone authenticated can create an order" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_menu_items_inst_price ON public.menu_items(institution_id, price);
CREATE INDEX IF NOT EXISTS idx_menu_items_vendor ON public.menu_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendors_inst_area ON public.vendors(institution_id, campus_area_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_status ON public.orders(vendor_id, status);
