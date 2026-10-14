# CLICK MODAS 25 — E-COMMERCE INFANTIL PROFISSIONAL

Plataforma de e-commerce completa, profissional e responsiva desenvolvida especificamente para a **Click Modas 25**, especializada em moda infantil (tamanhos 2 a 16).

---

## 🌟 Principais Funcionalidades

1. **Vitrine & Catálogo Interativo**:
   - Categorias: Vestidos Infantis, Conjuntos Menina, Conjuntos Menino, Linha Bebê e Casacos.
   - Filtros dinâmicos em tempo real por Categoria, Tamanho Infantil (2 ao 16), busca textual por nome e SKU, e ordenação (preço menor/maior, novidades, nome).
   - URLs compartilháveis com parâmetros (`?categoria=...&tamanho=...&busca=...`).

2. **Página de Produto Completa**:
   - Galeria de fotos responsiva com seletor de miniaturas.
   - Seleção de tamanho (2 a 16) e cor com estoque individual em tempo real.
   - Guia de Medidas integrado em janela modal (idade estimada, tórax, cintura, altura).
   - Botão direto "Adicionar à Sacola" e botão "Tirar Dúvida no WhatsApp".
   - Schema.org JSON-LD para indexação de produtos no Google.

3. **Checkout Inteligente via WhatsApp**:
   - Revalidação em tempo real dos preços e limites de estoque antes da submissão.
   - Criação automática de **Intenção de Pedido** com código exclusivo rastreável (`CMD-YYYYMMDD-XXXX`).
   - Geração de mensagem estruturada e codificada com itens, tamanhos, cores, quantidades, subtotal e preferência de entrega.
   - Abertura direta do WhatsApp comercial (`+55 11 95468-6239`).
   - Sem solicitação desnecessária de cartão ou frete fictício.

4. **Painel Administrativo Intuitivo (`/admin`)**:
   - **Dashboard**: Métricas reais com diferenciação entre pedidos iniciados e vendas confirmadas, faturamento efetivado, gráficos do funil de conversão com Recharts e alertas de estoque baixo (≤ 5 un).
   - **Produtos**: Cadastro, edição, duplicação, exclusão com integridade, upload de fotos e configuração de variantes (tamanhos 2 ao 16) com SKU.
   - **Estoque**: Visão por variante de tamanho/cor, ajuste manual com registro de motivo e prevenção contra estoque negativo.
   - **Pedidos**: Acompanhamento de status (`pedido_iniciado`, `aguardando_confirmacao`, `confirmado`, `aguardando_pagamento`, `pago`, `em_separacao`, `enviado`, `entregue`, `cancelado`), inserção de frete e notas internas, botão direto de WhatsApp com o cliente e exportação em CSV.
   - **Conteúdo & Marketing**: Gestão de banners da home e edição de textos institucionais.
   - **Configurações**: Dados da loja, WhatsApp oficial, Instagram e regras de estoque.

---

## 🎨 Paleta Visual Oficial

- **Roxo Primário**: `#7544A0`
- **Lilás**: `#A879CF`
- **Rosa**: `#E88CB8`
- **Rosa Claro**: `#FBEAF4`
- **Branco**: `#FFFFFF`
- **Texto Escuro**: `#30283B`

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js 18+ ou 20+ instalado
- npm ou yarn

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Executando os Testes Automatizados
```bash
npm test
```

### 5. Compilação de Produção
```bash
npm run build
```

### 6. Iniciando o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` para a loja pública e `http://localhost:3000/admin` para o painel de controle.

---

## 🗄️ Estrutura do Banco de Dados (Supabase PostgreSQL)

As migrations versionadas e o arquivo de carga inicial encontram-se em:
- `supabase/migrations/20261014000001_initial_schema.sql` (Tabelas, índices, triggers, RLS e RPCs de estoque seguro)
- `supabase/migrations/20261014000002_storage_setup.sql` (Buckets de storage para fotos de produtos e banners)
- `supabase/seed.sql` (Carga inicial com categorias, catálogo infantil 2 ao 16, banners e guia de medidas)

---

## 🌐 Implantação na Vercel

1. Envie o repositório para o GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: e-commerce Click Modas 25"
   ```
2. Acesse [vercel.com](https://vercel.com) e importe o repositório.
3. Configure as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`).
4. Clique em **Deploy**.
