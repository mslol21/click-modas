-- ==============================================================================
-- CLICK MODAS 25 - SEED DATA (DADOS INICIAIS DA LOJA)
-- ==============================================================================

-- 1. STORE SETTINGS
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

-- 2. CATEGORIES
insert into public.categories (id, name, slug, description, image_url, sort_order) values
('11111111-1111-1111-1111-111111111001', 'Vestidos Infantis', 'vestidos-infantis', 'Vestidos delicados, florais e festivos para meninas.', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80', 1),
('11111111-1111-1111-1111-111111111002', 'Conjuntos Menina', 'conjuntos-menina', 'Conjuntinhos modernos, confortáveis e práticos para o dia a dia e passeios.', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&auto=format&fit=crop&q=80', 2),
('11111111-1111-1111-1111-111111111003', 'Conjuntos Menino', 'conjuntos-menino', 'Bermudas, camisetas e pólos estilosas do tamanho 2 ao 16.', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80', 3),
('11111111-1111-1111-1111-111111111004', 'Linha Bebê', 'linha-bebe', 'Bodies, macacões e saídas de maternidade suaves e hipoalergênicas.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80', 4),
('11111111-1111-1111-1111-111111111005', 'Casacos & Jaquetas', 'casacos-jaquetas', 'Cardigans, corta-ventos e jaquetas para manter as crianças aquecidas com charme.', 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?w=600&auto=format&fit=crop&q=80', 5)
on conflict (id) do nothing;

-- 3. BANNERS
insert into public.banners (id, title, subtitle, image_url, link_url, button_text, sort_order) values
('22222222-2222-2222-2222-222222222001', 'Coleção Primavera Encantada', 'Moda infantil delicada e confortável do tamanho 2 ao 16 com o melhor preço de São Paulo.', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1600&auto=format&fit=crop&q=80', '/catalogo', 'Explorar Catálogo', 1),
('22222222-2222-2222-2222-222222222002', 'Conjuntos Especiais para Passeios', 'Peças leves e resistentes para momentos de muita diversão e alegria.', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1600&auto=format&fit=crop&q=80', '/catalogo?categoria=conjuntos-menina', 'Ver Conjuntos', 2)
on conflict (id) do nothing;

-- 4. PRODUCTS
insert into public.products (id, category_id, name, slug, description, price, promotional_price, sku_base, is_published, is_featured) values
(
    '33333333-3333-3333-3333-333333333001',
    '11111111-1111-1111-1111-111111111001',
    'Vestido Floral Jardim Secreto',
    'vestido-floral-jardim-secreto',
    'Vestido infantil confeccionado em tecido 100% algodão macio com estampa floral delicada. Possui laço decorativo na cintura e caimento rodado perfeito para festas e passeios.',
    79.90,
    69.90,
    'CMD-VES-001',
    true,
    true
),
(
    '33333333-3333-3333-3333-333333333002',
    '11111111-1111-1111-1111-111111111002',
    'Conjunto Menina Blusa Lilás e Shorts Jeans',
    'conjunto-menina-blusa-lilas-shorts-jeans',
    'Conjunto super charmoso composto por blusa lilás em ribana canelada com detalhes nas mangas e shorts jeans macio com elástico ajustável no cós.',
    89.90,
    null,
    'CMD-CNJ-002',
    true,
    true
),
(
    '33333333-3333-3333-3333-333333333003',
    '11111111-1111-1111-1111-111111111003',
    'Conjunto Menino Camisa Polo e Bermuda Sarja',
    'conjunto-menino-camisa-polo-bermuda-sarja',
    'Look moderno para meninos. Camisa polo em piquê respirável com bordado discreto e bermuda em sarja de toque suave com bolsos funcionais.',
    94.90,
    84.90,
    'CMD-CNJ-003',
    true,
    true
),
(
    '33333333-3333-3333-3333-333333333004',
    '11111111-1111-1111-1111-111111111001',
    'Vestido Princesa Festa com Tule e Brilho',
    'vestido-princesa-festa-com-tule-e-brilho',
    'Vestido de gala infantil com saia em camadas de tule volumoso, corpo em tafetá forrado e detalhes cintilantes. Ideal para aniversários e celebrações especiais.',
    129.90,
    119.90,
    'CMD-VES-004',
    true,
    true
),
(
    '33333333-3333-3333-3333-333333333005',
    '11111111-1111-1111-1111-111111111004',
    'Kit Body Bebê Cotton Conforto 3 Peças',
    'kit-body-bebe-cotton-conforto-3-pecas',
    'Trio de bodies em malha 100% suedine antialérgica com gola envelope para facilitar na troca e fecho com botões de pressão reforçados.',
    65.00,
    59.90,
    'CMD-BEB-005',
    true,
    false
),
(
    '33333333-3333-3333-3333-333333333006',
    '11111111-1111-1111-1111-111111111005',
    'Cardigan Infantil Tricot Corações',
    'cardigan-infantil-tricot-coracoes',
    'Cardigan confeccionado em tricot com ponto trabalhado e pequenos relevos em formato de coração. Botões frontais perolados.',
    89.90,
    null,
    'CMD-CAS-006',
    true,
    false
)
on conflict (id) do nothing;

-- 5. PRODUCT IMAGES
insert into public.product_images (product_id, image_url, alt_text, sort_order, is_cover) values
('33333333-3333-3333-3333-333333333001', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80', 'Vestido Floral Jardim Secreto Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333002', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80', 'Conjunto Menina Blusa Lilás Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333003', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80', 'Conjunto Menino Camisa Polo Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333004', 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800&auto=format&fit=crop&q=80', 'Vestido Princesa Festa com Tule Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333005', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80', 'Kit Body Bebê Cotton Conforto Click Modas 25', 1, true),
('33333333-3333-3333-3333-333333333006', 'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?w=800&auto=format&fit=crop&q=80', 'Cardigan Infantil Tricot Click Modas 25', 1, true);

-- 6. PRODUCT VARIANTS (Tamanhos 2 a 16 e cores)
insert into public.product_variants (product_id, size, color, color_hex, sku, stock) values
-- Vestido Floral
('33333333-3333-3333-3333-333333333001', '4', 'Rosa Floral', '#E88CB8', 'CMD-VES-001-4-ROS', 12),
('33333333-3333-3333-3333-333333333001', '6', 'Rosa Floral', '#E88CB8', 'CMD-VES-001-6-ROS', 8),
('33333333-3333-3333-3333-333333333001', '8', 'Rosa Floral', '#E88CB8', 'CMD-VES-001-8-ROS', 15),
('33333333-3333-3333-3333-333333333001', '10', 'Rosa Floral', '#E88CB8', 'CMD-VES-001-10-ROS', 6),
('33333333-3333-3333-3333-333333333001', '4', 'Lilás Floral', '#A879CF', 'CMD-VES-001-4-LIL', 10),
('33333333-3333-3333-3333-333333333001', '6', 'Lilás Floral', '#A879CF', 'CMD-VES-001-6-LIL', 9),
('33333333-3333-3333-3333-333333333001', '8', 'Lilás Floral', '#A879CF', 'CMD-VES-001-8-LIL', 7),

-- Conjunto Menina
('33333333-3333-3333-3333-333333333002', '6', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-6-LIL', 14),
('33333333-3333-3333-3333-333333333002', '8', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-8-LIL', 11),
('33333333-3333-3333-3333-333333333002', '10', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-10-LIL', 5),
('33333333-3333-3333-3333-333333333002', '12', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-12-LIL', 8),
('33333333-3333-3333-3333-333333333002', '14', 'Lilás e Denim', '#A879CF', 'CMD-CNJ-002-14-LIL', 4),

-- Conjunto Menino
('33333333-3333-3333-3333-333333333003', '4', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-4-AZM', 10),
('33333333-3333-3333-3333-333333333003', '6', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-6-AZM', 12),
('33333333-3333-3333-3333-333333333003', '8', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-8-AZM', 9),
('33333333-3333-3333-3333-333333333003', '10', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-10-AZM', 6),
('33333333-3333-3333-3333-333333333003', '12', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-12-AZM', 7),
('33333333-3333-3333-3333-333333333003', '14', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-14-AZM', 3),
('33333333-3333-3333-3333-333333333003', '16', 'Azul Marinho / Bege', '#1E3A8A', 'CMD-CNJ-003-16-AZM', 5),

-- Vestido Princesa Festa
('33333333-3333-3333-3333-333333333004', '4', 'Rosa Bebê', '#FBCFE8', 'CMD-VES-004-4-ROB', 5),
('33333333-3333-3333-3333-333333333004', '6', 'Rosa Bebê', '#FBCFE8', 'CMD-VES-004-6-ROB', 8),
('33333333-3333-3333-3333-333333333004', '8', 'Rosa Bebê', '#FBCFE8', 'CMD-VES-004-8-ROB', 6),
('33333333-3333-3333-3333-333333333004', '10', 'Rosa Bebê', '#FBCFE8', 'CMD-VES-004-10-ROB', 4),

-- Kit Body Bebê
('33333333-3333-3333-3333-333333333005', 'M', 'Pastel Misto', '#FEF3C7', 'CMD-BEB-005-M-PAS', 20),
('33333333-3333-3333-3333-333333333005', 'G', 'Pastel Misto', '#FEF3C7', 'CMD-BEB-005-G-PAS', 18),

-- Cardigan Tricot
('33333333-3333-3333-3333-333333333006', '6', 'Off White', '#FAF5FF', 'CMD-CAS-006-6-OFW', 7),
('33333333-3333-3333-3333-333333333006', '8', 'Off White', '#FAF5FF', 'CMD-CAS-006-8-OFW', 9),
('33333333-3333-3333-3333-333333333006', '10', 'Off White', '#FAF5FF', 'CMD-CAS-006-10-OFW', 5)
on conflict (sku) do nothing;
