-- ==============================================================================
-- CLICK MODAS 25 - CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS (SUPABASE POSTGRESQL)
-- Execute este script no SQL Editor do Supabase (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. EXTENSÃO UUID
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. TABELAS PRINCIPAIS
-- ==============================================================================

-- Profiles & Roles
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

-- Categorias Infantis
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

-- Produtos
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

-- Variantes de Produto (Tamanhos 2 a 16 e Cores)
create table if not exists public.product_variants (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid not null references public.products(id) on delete cascade,
    size text not null,
    color text not null,
    color_hex text,
    sku text not null unique,
    stock integer not null default 0 check (stock >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Fotos dos Produtos
create table if not exists public.product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid not null references public.products(id) on delete cascade,
    image_url text not null,
    alt_text text,
    sort_order integer default 0 not null,
    is_cover boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Controle e Histórico de Estoque
create table if not exists public.inventory_movements (
    id uuid primary key default uuid_generate_v4(),
    variant_id uuid not null references public.product_variants(id) on delete cascade,
    movement_type text not null check (movement_type in ('entry', 'sale', 'adjustment', 'return', 'cancellation')),
    quantity integer not null,
    previous_stock integer not null,
    new_stock integer not null check (new_stock >= 0),
    reason text not null,
    performed_by uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clientes
create table if not exists public.customers (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    phone text not null,
    email text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pedidos (WhatsApp Checkout)
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text not null unique,
    customer_id uuid references public.customers(id) on delete set null,
    customer_name text not null,
    customer_phone text not null,
    delivery_method text not null,
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
    payment_method text,
    customer_notes text,
    internal_notes text,
    whatsapp_message_sent boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Itens do Pedido (Snapshot Histórico)
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

-- Banners da Home
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

-- Configurações da Loja
create table if not exists public.store_settings (
    key text primary key,
    value jsonb not null,
    description text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Auditoria
create table if not exists public.audit_logs (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete set null,
    action text not null,
    entity_name text not null,
    entity_id text,
    details jsonb,
    ip_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. ÍNDICES DE PERFORMANCE
-- ==============================================================================
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_is_published on public.products(is_published);
create index if not exists idx_products_is_featured on public.products(is_featured);
create index if not exists idx_product_variants_product on public.product_variants(product_id);
create index if not exists idx_product_variants_size on public.product_variants(size);
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_inventory_movements_variant on public.inventory_movements(variant_id);

-- ==============================================================================
-- 4. FUNÇÕES RPC E TRIGGERS
-- ==============================================================================
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 from public.admin_roles
        where admin_roles.user_id = $1
    );
end;
$$ language plpgsql security definer set search_path = public;

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

-- RPC Ajuste Seguro de Estoque
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
-- 5. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.banners enable row level security;
alter table public.store_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Políticas de Profiles e Roles
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id or public.is_admin(auth.uid()) or auth.role() = 'service_role');

create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
    for insert with check (auth.uid() = id or auth.role() = 'service_role');

drop policy if exists "Users can read own role" on public.admin_roles;
drop policy if exists "Admins can manage roles" on public.admin_roles;

create policy "Users can read own role" on public.admin_roles
    for select using (auth.uid() = user_id);

create policy "Admins can manage roles" on public.admin_roles
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role');

-- Políticas de Leitura Pública
create policy "Public can view active categories" on public.categories
    for select using (is_active = true or public.is_admin(auth.uid()));

create policy "Public can view published products" on public.products
    for select using (is_published = true or public.is_admin(auth.uid()));

create policy "Public can view product variants" on public.product_variants
    for select using (true);

create policy "Public can view product images" on public.product_images
    for select using (true);

create policy "Public can view active banners" on public.banners
    for select using (is_active = true or public.is_admin(auth.uid()));

create policy "Public can view store settings" on public.store_settings
    for select using (true);

-- Criação de Pedidos e Clientes
create policy "Public can create orders" on public.orders
    for insert with check (true);

create policy "Admins can view and manage orders" on public.orders
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

create policy "Public can create order items" on public.order_items
    for insert with check (true);

create policy "Admins can view and manage order items" on public.order_items
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

create policy "Public can create customers" on public.customers
    for insert with check (true);

create policy "Admins can view and manage customers" on public.customers
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

-- Administradores
create policy "Admins have full access to categories" on public.categories
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

create policy "Admins have full access to products" on public.products
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

create policy "Admins have full access to product variants" on public.product_variants
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

create policy "Admins have full access to product images" on public.product_images
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

create policy "Admins have full access to inventory movements" on public.inventory_movements
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

create policy "Admins have full access to banners" on public.banners
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

create policy "Admins have full access to store settings" on public.store_settings
    for all using (public.is_admin(auth.uid()) or auth.role() = 'service_role' or auth.uid() is not null);

-- ==============================================================================
-- 6. STORAGE BUCKETS
-- ==============================================================================
insert into storage.buckets (id, name, public)
values 
    ('products', 'products', true),
    ('banners', 'banners', true)
on conflict (id) do update set public = true;

create policy "Public Access to Product Images"
on storage.objects for select
using (bucket_id in ('products', 'banners'));

create policy "Admin Manage Storage Images"
on storage.objects for all
using (bucket_id in ('products', 'banners'));

-- ==============================================================================
-- 7. SEED DATA (DADOS INICIAIS DA LOJA)
-- ==============================================================================

-- Configurações gerais
insert into public.store_settings (key, value, description) values
(
    'general',
    '{
        "name": "Click Modas 25",
        "tagline": "Moda Infantil do Tamanho 2 ao 16",
        "whatsapp": "5511954686239",
        "whatsapp_formatted": "(11) 95468-6239",
        "instagram": "@clickmodas_kids",
        "instagram_url": "https://instagram.com/clickmodas_kids",
        "reference_location": "Galeria Arco-Íris, São Paulo",
        "delivery_policy": "Modalidade e custo de entrega confirmados diretamente pela loja via WhatsApp.",
        "pickup_info": "Retiradas disponíveis na Galeria Arco-Íris, São Paulo, mediante agendamento prévio após confirmação do pedido."
    }'::jsonb,
    'Configurações gerais e canais de atendimento'
),
(
    'size_guide',
    '[
        {"size": "2", "age": "1 a 2 anos", "chest": "52 cm", "waist": "50 cm", "height": "86 - 92 cm"},
        {"size": "4", "age": "3 a 4 anos", "chest": "56 cm", "waist": "54 cm", "height": "98 - 104 cm"},
        {"size": "6", "age": "5 a 6 anos", "chest": "60 cm", "waist": "56 cm", "height": "110 - 116 cm"},
        {"size": "8", "age": "7 a 8 anos", "chest": "64 cm", "waist": "58 cm", "height": "122 - 128 cm"},
        {"size": "10", "age": "9 a 10 anos", "chest": "70 cm", "waist": "62 cm", "height": "134 - 140 cm"},
        {"size": "12", "age": "11 a 12 anos", "chest": "76 cm", "waist": "66 cm", "height": "146 - 152 cm"},
        {"size": "14", "age": "13 a 14 anos", "chest": "80 cm", "waist": "69 cm", "height": "156 - 160 cm"},
        {"size": "16", "age": "15 a 16 anos", "chest": "84 cm", "waist": "72 cm", "height": "162 - 166 cm"}
    ]'::jsonb,
    'Guia de medidas padrão para tamanhos 2 ao 16'
),
(
    'institutional',
    '{
        "about": "A Click Modas 25 nasceu para oferecer moda infantil delicada, estilosa e com preço justo para famílias e lojistas de todo o Brasil. Localizada estrategicamente na referência da Galeria Arco-Íris em São Paulo, trabalhamos com carinho selecionando peças confortáveis que acompanham cada fase do crescimento, dos tamanhos 2 ao 16.",
        "delivery": "Trabalhamos com envio para todo o território nacional e opção de retirada presencial na Galeria Arco-Íris (São Paulo). A modalidade de entrega (Correios, transportadora ou motoboy) e o custo exato do frete são confirmados e combinados individualmente pelo nosso WhatsApp para garantir a melhor tarifa para você.",
        "exchange": "As solicitações de troca devem ser informadas em até 7 (sete) dias corridos após o recebimento das peças via WhatsApp. O produto deve estar sem sinais de uso, com etiqueta fixada e embalagem original preservada.",
        "privacy": "A Click Modas 25 respeita a privacidade de nossos clientes. Coletamos apenas as informações essenciais (como nome e contato) necessárias para viabilizar o atendimento e a separação dos seus pedidos via WhatsApp. Seus dados nunca são vendidos a terceiros.",
        "terms": "Os pedidos iniciados através da plataforma representam uma intenção de compra. A confirmação de disponibilidade de estoque, prazo de entrega e pagamento é efetuada diretamente pelo nosso canal oficial de WhatsApp."
    }'::jsonb,
    'Conteúdo institucional editável da loja'
)
on conflict (key) do update set value = excluded.value;

-- Categorias
insert into public.categories (id, name, slug, description, image_url, sort_order) values
('11111111-1111-1111-1111-111111111001', 'Vestidos Infantis', 'vestidos-infantis', 'Vestidos delicados, florais e festivos para meninas.', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80', 1),
('11111111-1111-1111-1111-111111111002', 'Conjuntos Menina', 'conjuntos-menina', 'Conjuntinhos modernos, confortáveis e práticos para o dia a dia e passeios.', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=80', 2),
('11111111-1111-1111-1111-111111111003', 'Conjuntos Menino', 'conjuntos-menino', 'Bermudas, camisetas e pólos estilosas do tamanho 2 ao 16.', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80', 3),
('11111111-1111-1111-1111-111111111004', 'Linha Bebê', 'linha-bebe', 'Bodies, macacões e saídas de maternidade suaves e hipoalergênicas.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80', 4),
('11111111-1111-1111-1111-111111111005', 'Casacos & Jaquetas', 'casacos-jaquetas', 'Cardigans, corta-ventos e jaquetas para manter as crianças aquecidas com charme.', 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?w=600&auto=format&fit=crop&q=80', 5)
on conflict (id) do nothing;

-- Banners
insert into public.banners (id, title, subtitle, image_url, link_url, button_text, sort_order) values
('22222222-2222-2222-2222-222222222001', 'Coleção Primavera Encantada', 'Moda infantil delicada e confortável do tamanho 2 ao 16 com o melhor preço de São Paulo.', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1600&auto=format&fit=crop&q=80', '/catalogo', 'Explorar Catálogo', 1),
('22222222-2222-2222-2222-222222222002', 'Conjuntos Especiais para Passeios', 'Peças leves e resistentes para momentos de muita diversão e alegria.', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1600&auto=format&fit=crop&q=80', '/catalogo?categoria=conjuntos-menina', 'Ver Conjuntos', 2)
on conflict (id) do nothing;

-- Produtos
insert into public.products (id, category_id, name, slug, description, price, promotional_price, sku_base, is_published, is_featured) values
('33333333-3333-3333-3333-333333333001', '11111111-1111-1111-1111-111111111001', 'Vestido Floral Jardim Secreto', 'vestido-floral-jardim-secreto', 'Vestido infantil confeccionado em tecido 100% algodão macio com estampa floral delicada. Possui laço decorativo na cintura e caimento rodado perfeito para festas e passeios.', 79.90, 69.90, 'CMD-VES-001', true, true),
('33333333-3333-3333-3333-333333333002', '11111111-1111-1111-1111-111111111002', 'Conjunto Menina Blusa Lilás e Shorts Jeans', 'conjunto-menina-blusa-lilas-shorts-jeans', 'Conjunto super charmoso composto por blusa lilás em ribana canelada com detalhes nas mangas e shorts jeans macio com elástico ajustável no cós.', 89.90, null, 'CMD-CNJ-002', true, true),
('33333333-3333-3333-3333-333333333003', '11111111-1111-1111-1111-111111111003', 'Conjunto Menino Camisa Polo e Bermuda Sarja', 'conjunto-menino-camisa-polo-bermuda-sarja', 'Look moderno para meninos. Camisa polo em piquê respirável com bordado discreto e bermuda em sarja de toque suave com bolsos funcionais.', 94.90, 84.90, 'CMD-CNJ-003', true, true),
('33333333-3333-3333-3333-333333333004', '11111111-1111-1111-1111-111111111001', 'Vestido Princesa Festa com Tule e Brilho', 'vestido-princesa-festa-com-tule-e-brilho', 'Vestido de gala infantil com saia em camadas de tule volumoso, corpo em tafetá forrado e detalhes cintilantes. Ideal para aniversários e celebrações especiais.', 129.90, 119.90, 'CMD-VES-004', true, true),
('33333333-3333-3333-3333-333333333005', '11111111-1111-1111-1111-111111111004', 'Kit Body Bebê Cotton Conforto 3 Peças', 'kit-body-bebe-cotton-conforto-3-pecas', 'Trio de bodies em malha 100% suedine antialérgica com gola envelope para facilitar na troca e fecho com botões de pressão reforçados.', 65.00, 59.90, 'CMD-BEB-005', true, false),
('33333333-3333-3333-3333-333333333006', '11111111-1111-1111-1111-111111111005', 'Cardigan Infantil Tricot Corações', 'cardigan-infantil-tricot-coracoes', 'Cardigan confeccionado em tricot com ponto trabalhado e pequenos relevos em formato de coração. Botões frontais perolados.', 89.90, null, 'CMD-CAS-006', true, false)
on conflict (id) do nothing;

-- Fotos
insert into public.product_images (product_id, image_url, alt_text, sort_order, is_cover) values
('33333333-3333-3333-3333-333333333001', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80', 'Vestido Floral Jardim Secreto Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333002', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80', 'Conjunto Menina Blusa Lilás Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333003', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80', 'Conjunto Menino Camisa Polo Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333004', 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&auto=format&fit=crop&q=80', 'Vestido Princesa Festa com Tule Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333005', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80', 'Kit Body Bebê Cotton Conforto Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333006', 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?w=800&auto=format&fit=crop&q=80', 'Cardigan Infantil Tricot Click Modas 25', 1, true);

-- Variantes com tamanhos e estoque
insert into public.product_variants (product_id, size, color, color_hex, sku, stock) values
('33333333-3333-3333-3333-333333333001', '4', 'Rosa Floral', '#E88CB8', 'CMD-VES-001-4-ROS', 12),
('33333333-3333-3333-3333-333333333001', '6', 'Rosa Floral', '#E88CB8', 'CMD-VES-001-6-ROS', 8),
('33333333-3333-3333-3333-333333333001', '8', 'Rosa Floral', '#E88CB8', 'CMD-VES-001-8-ROS', 15),
('33333333-3333-3333-3333-333333333001', '10', 'Rosa Floral', '#E88CB8', 'CMD-VES-001-10-ROS', 6),
('33333333-3333-3333-3333-333333333001', '4', 'Lilás Floral', '#A879CF', 'CMD-VES-001-4-LIL', 10),
('33333333-3333-3333-3333-333333333001', '6', 'Lilás Floral', '#A879CF', 'CMD-VES-001-6-LIL', 9),
('33333333-3333-3333-3333-333333333001', '8', 'Lilás Floral', '#A879CF', 'CMD-VES-001-8-LIL', 7),
('33333333-3333-3333-3333-333333333002', '6', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-6-LIL', 14),
('33333333-3333-3333-3333-333333333002', '8', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-8-LIL', 11),
('33333333-3333-3333-3333-333333333002', '10', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-10-LIL', 5),
('33333333-3333-3333-3333-333333333002', '12', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-12-LIL', 8),
('33333333-3333-3333-3333-333333333002', '14', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-14-LIL', 4),
('33333333-3333-3333-3333-333333333003', '4', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-4-AZM', 10),
('33333333-3333-3333-3333-333333333003', '6', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-6-AZM', 12),
('33333333-3333-3333-3333-333333333003', '8', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-8-AZM', 9),
('33333333-3333-3333-3333-333333333003', '10', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-10-AZM', 6),
('33333333-3333-3333-3333-333333333003', '12', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-12-AZM', 7),
('33333333-3333-3333-3333-333333333003', '14', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-14-AZM', 3),
('33333333-3333-3333-3333-333333333003', '16', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-16-AZM', 5),
('33333333-3333-3333-3333-333333333004', '4', 'Rosa Bebê', '#FBCFE8', 'CMD-VES-004-4-ROB', 5),
('33333333-3333-3333-3333-333333333004', '6', 'Rosa Bebê', '#FBCFE8', 'CMD-VES-004-6-ROB', 8),
('33333333-3333-3333-3333-333333333004', '8', 'Rosa Bebê', '#FBCFE8', 'CMD-VES-004-8-ROB', 6),
('33333333-3333-3333-3333-333333333004', '10', 'Rosa Bebê', '#FBCFE8', 'CMD-VES-004-10-ROB', 4),
('33333333-3333-3333-3333-333333333005', 'M', 'Pastel Misto', '#FEF3C7', 'CMD-BEB-005-M-PAS', 20),
('33333333-3333-3333-3333-333333333005', 'G', 'Pastel Misto', '#FEF3C7', 'CMD-BEB-005-G-PAS', 18),
('33333333-3333-3333-3333-333333333006', '6', 'Off White', '#FAF5FF', 'CMD-CAS-006-6-OFW', 7),
('33333333-3333-3333-3333-333333333006', '8', 'Off White', '#FAF5FF', 'CMD-CAS-006-8-OFW', 9),
('33333333-3333-3333-3333-333333333006', '10', 'Off White', '#FAF5FF', 'CMD-CAS-006-10-OFW', 5)
on conflict (sku) do nothing;
