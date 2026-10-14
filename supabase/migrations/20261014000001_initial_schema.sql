-- ==============================================================================
-- CLICK MODAS 25 - SCHEMA MIGRATION 20261014000001_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES & ROLES
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    email text not null,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.admin_roles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    role text not null check (role in ('super_admin', 'admin', 'operator')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, role)
);

-- 2. CATEGORIES
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    description text,
    image_url text,
    sort_order integer default 0 not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCTS
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    category_id uuid references public.categories(id) on delete set null,
    name text not null,
    slug text not null unique,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    promotional_price numeric(10, 2) check (promotional_price is null or promotional_price >= 0),
    sku_base text,
    is_published boolean default true not null,
    is_featured boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCT VARIANTS (Tamanhos 2 a 16 e Cores)
create table if not exists public.product_variants (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid not null references public.products(id) on delete cascade,
    size text not null, -- Ex: '2', '4', '6', '8', '10', '12', '14', '16'
    color text not null, -- Ex: 'Rosa Bebê', 'Lilás Floral', 'Azul Marinho'
    color_hex text, -- Código hexadecimal opcional para amostra visual
    sku text not null unique,
    stock integer not null default 0 check (stock >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PRODUCT IMAGES
create table if not exists public.product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid not null references public.products(id) on delete cascade,
    image_url text not null,
    alt_text text,
    sort_order integer default 0 not null,
    is_cover boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. INVENTORY MOVEMENTS & RESERVATIONS
create table if not exists public.inventory_movements (
    id uuid primary key default uuid_generate_v4(),
    variant_id uuid not null references public.product_variants(id) on delete cascade,
    movement_type text not null check (movement_type in ('entry', 'sale', 'adjustment', 'return', 'cancellation')),
    quantity integer not null, -- positivo ou negativo
    previous_stock integer not null,
    new_stock integer not null check (new_stock >= 0),
    reason text not null,
    performed_by uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.inventory_reservations (
    id uuid primary key default uuid_generate_v4(),
    variant_id uuid not null references public.product_variants(id) on delete cascade,
    order_id uuid, -- referenciado posteriormente
    quantity integer not null check (quantity > 0),
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. CUSTOMERS
create table if not exists public.customers (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    phone text not null,
    email text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. ORDERS & ORDER ITEMS
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text not null unique, -- Ex: 'CMD-20261014-001'
    customer_id uuid references public.customers(id) on delete set null,
    customer_name text not null,
    customer_phone text not null,
    delivery_method text not null, -- Ex: 'retirada_galeria_arco_iris', 'combinar_envio'
    delivery_fee numeric(10, 2) default 0.00 check (delivery_fee >= 0),
    delivery_address text,
    subtotal numeric(10, 2) not null check (subtotal >= 0),
    total numeric(10, 2) not null check (total >= 0),
    status text not null default 'pedido_iniciado' check (
        status in (
            'pedido_iniciado',
            'aguardando_confirmacao',
            'confirmado',
            'aguardando_pagamento',
            'pago',
            'em_separacao',
            'enviado',
            'entregue',
            'cancelado'
        )
    ),
    payment_method text, -- Ex: 'Pix (confirmado via WhatsApp)', 'Dinheiro na Retirada'
    customer_notes text,
    internal_notes text,
    whatsapp_message_sent boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add reference to inventory_reservations now that orders exists
alter table public.inventory_reservations 
    add constraint fk_inventory_reservation_order 
    foreign key (order_id) references public.orders(id) on delete set null;

create table if not exists public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    variant_id uuid references public.product_variants(id) on delete set null,
    product_name text not null,
    variant_size text not null,
    variant_color text not null,
    sku text not null,
    unit_price numeric(10, 2) not null check (unit_price >= 0),
    quantity integer not null check (quantity > 0),
    total_price numeric(10, 2) not null check (total_price >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. BANNERS
create table if not exists public.banners (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    subtitle text,
    image_url text not null,
    link_url text,
    button_text text default 'Ver Coleção',
    sort_order integer default 0 not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. COLLECTIONS & COLLECTION PRODUCTS
create table if not exists public.collections (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    description text,
    banner_url text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.collection_products (
    collection_id uuid not null references public.collections(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete cascade,
    sort_order integer default 0 not null,
    primary key (collection_id, product_id)
);

-- 11. STORE SETTINGS & INSTITUTIONAL CONTENT
create table if not exists public.store_settings (
    key text primary key,
    value jsonb not null,
    description text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. AUDIT LOGS
create table if not exists public.audit_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete set null,
    action text not null, -- 'CREATE_PRODUCT', 'UPDATE_STOCK', 'CHANGE_ORDER_STATUS', etc.
    entity_name text not null,
    entity_id text,
    details jsonb,
    ip_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_is_published on public.products(is_published);
create index if not exists idx_products_is_featured on public.products(is_featured);
create index if not exists idx_product_variants_product on public.product_variants(product_id);
create index if not exists idx_product_variants_size on public.product_variants(size);
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_inventory_movements_variant on public.inventory_movements(variant_id);

-- ==============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Function to check if a user is an admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 from public.admin_roles
        where admin_roles.user_id = $1
    );
end;
$$ language plpgsql security definer;

-- Trigger to auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create or replace trigger tr_products_updated_at before update on public.products
for each row execute function public.handle_updated_at();

create or replace trigger tr_categories_updated_at before update on public.categories
for each row execute function public.handle_updated_at();

create or replace trigger tr_orders_updated_at before update on public.orders
for each row execute function public.handle_updated_at();

create or replace trigger tr_store_settings_updated_at before update on public.store_settings
for each row execute function public.handle_updated_at();

-- Safe Stock Adjustment RPC function (avoids race condition and negative stock)
create or replace function public.adjust_variant_stock(
    p_variant_id uuid,
    p_quantity_change integer,
    p_reason text,
    p_user_id uuid default null
) returns integer as $$
declare
    v_current_stock integer;
    v_new_stock integer;
    v_type text;
begin
    -- Lock row for update
    select stock into v_current_stock
    from public.product_variants
    where id = p_variant_id
    for update;

    if not found then
        raise exception 'Variante não encontrada.';
    end if;

    v_new_stock := v_current_stock + p_quantity_change;

    if v_new_stock < 0 then
        raise exception 'Estoque insuficiente. Disponível: %, Solicitado: %', v_current_stock, abs(p_quantity_change);
    end if;

    update public.product_variants
    set stock = v_new_stock, updated_at = timezone('utc'::text, now())
    where id = p_variant_id;

    if p_quantity_change > 0 then
        v_type := 'entry';
    else
        v_type := 'adjustment';
    end if;

    insert into public.inventory_movements (
        variant_id,
        movement_type,
        quantity,
        previous_stock,
        new_stock,
        reason,
        performed_by
    ) values (
        p_variant_id,
        v_type,
        p_quantity_change,
        v_current_stock,
        v_new_stock,
        p_reason,
        p_user_id
    );

    return v_new_stock;
end;
$$ language plpgsql security definer;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.banners enable row level security;
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.store_settings enable row level security;
alter table public.audit_logs enable row level security;

-- 1. PROFILES & ROLES: Only self or admin can view profile
create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Admins can view roles" on public.admin_roles
    for select using (public.is_admin(auth.uid()));

-- 2. PUBLIC READ POLICIES
create policy "Public can view active categories" on public.categories
    for select using (is_active = true or public.is_admin(auth.uid()));

create policy "Public can view published products" on public.products
    for select using (is_published = true or public.is_admin(auth.uid()));

create policy "Public can view product variants" on public.product_variants
    for select using (
        exists (
            select 1 from public.products
            where products.id = product_variants.product_id
            and (products.is_published = true or public.is_admin(auth.uid()))
        )
    );

create policy "Public can view product images" on public.product_images
    for select using (
        exists (
            select 1 from public.products
            where products.id = product_images.product_id
            and (products.is_published = true or public.is_admin(auth.uid()))
        )
    );

create policy "Public can view active banners" on public.banners
    for select using (is_active = true or public.is_admin(auth.uid()));

create policy "Public can view active collections" on public.collections
    for select using (is_active = true or public.is_admin(auth.uid()));

create policy "Public can view collection products" on public.collection_products
    for select using (true);

create policy "Public can view store settings" on public.store_settings
    for select using (true);

-- 3. ORDERS: Anyone can create an order intention, but only admins can read all orders
create policy "Public can create orders" on public.orders
    for insert with check (true);

create policy "Admins can view and manage orders" on public.orders
    for all using (public.is_admin(auth.uid()));

create policy "Public can create order items" on public.order_items
    for insert with check (true);

create policy "Admins can view and manage order items" on public.order_items
    for all using (public.is_admin(auth.uid()));

create policy "Public can create customers" on public.customers
    for insert with check (true);

create policy "Admins can view and manage customers" on public.customers
    for all using (public.is_admin(auth.uid()));

-- 4. ADMIN FULL ACCESS POLICIES
create policy "Admins have full access to categories" on public.categories
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to products" on public.products
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to product variants" on public.product_variants
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to product images" on public.product_images
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to inventory movements" on public.inventory_movements
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to inventory reservations" on public.inventory_reservations
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to banners" on public.banners
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to collections" on public.collections
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to store settings" on public.store_settings
    for all using (public.is_admin(auth.uid()));

create policy "Admins have full access to audit logs" on public.audit_logs
    for all using (public.is_admin(auth.uid()));
