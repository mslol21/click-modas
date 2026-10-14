import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getBanners, getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShoppingBag,
  Phone,
  Truck,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Instagram,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const banners = await getBanners();
  const categories = await getCategories();
  const featuredProducts = await getProducts({ featured: true });
  const latestProducts = await getProducts({ sort: "newest" });

  const primaryBanner = banners[0] || {
    title: "Coleção Primavera Encantada",
    subtitle: "Moda infantil delicada e confortável do tamanho 2 ao 16 com o melhor preço de São Paulo.",
    image_url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1600&auto=format&fit=crop&q=80",
    link_url: "/catalogo",
    button_text: "Explorar Catálogo",
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-brand-pinkLight/40 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border text-brand-purple text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-brand-pink" />
                <span>Nova Coleção Click Modas 25</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-dark leading-[1.15]">
                {primaryBanner.title}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {primaryBanner.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href={primaryBanner.link_url || "/catalogo"}>
                  <Button size="lg" className="rounded-full shadow-md w-full sm:w-auto">
                    {primaryBanner.button_text || "Ver Catálogo Completo"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <a
                  href="https://wa.me/5511954686239"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Falar no WhatsApp</span>
                  </Button>
                </a>
              </div>

              {/* Badges info */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-brand-lilac/20 text-xs text-muted-foreground text-center">
                <div>
                  <strong className="block text-sm text-brand-dark">2 ao 16</strong>
                  Tamanhos infantis
                </div>
                <div>
                  <strong className="block text-sm text-brand-dark">Pronta Entrega</strong>
                  São Paulo & Envio
                </div>
                <div>
                  <strong className="block text-sm text-brand-dark">Atendimento</strong>
                  Direto via WhatsApp
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={primaryBanner.image_url}
                  alt={primaryBanner.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                      Referência em São Paulo
                    </p>
                    <p className="text-sm font-bold text-brand-dark">
                      Galeria Arco-Íris
                    </p>
                  </div>
                  <span className="text-xs bg-brand-purple text-white px-3 py-1.5 rounded-full font-medium">
                    Atendimento Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIAS DE MODA INFANTIL */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
              Navegue por Departamentos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
              Categorias Infantis
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="text-sm font-semibold text-brand-purple hover:underline flex items-center gap-1"
          >
            Ver todas as peças
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.slug}`}
              className="group relative flex flex-col rounded-2xl border overflow-hidden bg-card hover:shadow-lg transition-all duration-300 hover:border-brand-lilac"
            >
              <div className="relative aspect-square w-full bg-muted overflow-hidden">
                <Image
                  src={
                    cat.image_url ||
                    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80"
                  }
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base leading-tight drop-shadow">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-white/90 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explorar peças →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PRODUTOS EM DESTAQUE */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
              <span>Mais Amados</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
              Produtos em Destaque
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="text-sm font-semibold text-brand-purple hover:underline"
          >
            Ver catálogo completo
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SEÇÃO DE LANÇAMENTOS */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-brand-pinkLight/30 p-6 sm:p-10 border border-brand-lilac/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                Recém Chegados
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
                Lançamentos da Estação
              </h2>
            </div>
            <Link
              href="/catalogo?sort=newest"
              className="text-sm font-semibold text-brand-purple hover:underline"
            >
              Ver todas as novidades
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA O PEDIDO PELO WHATSAPP */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
            Simplicidade & Segurança
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Como Comprar na Click Modas 25
          </h2>
          <p className="text-sm text-muted-foreground">
            Sem burocracia de cadastros longos ou pagamento prévio no site. Tudo é combinado com carinho direto pelo nosso WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-2xl p-6 border shadow-sm relative text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand-pinkLight text-brand-purple font-black text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-brand-dark mb-2">Escolha as Peças</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Navegue pelo catálogo e selecione o tamanho infantil ideal (do 2 ao 16) e a cor favorita.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border shadow-sm relative text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand-pinkLight text-brand-purple font-black text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-brand-dark mb-2">Monte sua Sacola</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adicione os itens ao carrinho. O sistema valida os preços e a disponibilidade em tempo real.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border shadow-sm relative text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand-pinkLight text-brand-purple font-black text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-brand-dark mb-2">Envie para o WhatsApp</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ao clicar em finalizar, geramos um código exclusivo com a lista completa para o nosso número comercial.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border shadow-sm relative text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand-pinkLight text-brand-purple font-black text-lg flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-base text-brand-dark mb-2">Confirme Entrega e Pgto</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nossa equipe confirma o pedido, calcula o frete ou agenda a retirada na Galeria Arco-Íris.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://wa.me/5511954686239"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#20BD5A] font-semibold text-sm px-6 py-3 rounded-full shadow-md transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Falar com Atendimento: (11) 95468-6239</span>
          </a>
        </div>
      </section>

      {/* 6. DIFERENCIAIS DA LOJA */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/40">
            <div className="p-3 rounded-xl bg-white text-brand-purple shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-dark">Envio ou Retirada</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Retirada na Galeria Arco-Íris (São Paulo) ou envio com frete cotado para a sua cidade.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/40">
            <div className="p-3 rounded-xl bg-white text-brand-purple shadow-sm">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-dark">Atendimento Humanizado</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Tire dúvidas sobre medidas, tecidos e caimento antes de confirmar seu pedido.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/40">
            <div className="p-3 rounded-xl bg-white text-brand-purple shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-dark">Qualidade e Preço Justo</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Moda infantil confortável do polo comercial de São Paulo direto para sua família.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM & REDES */}
      <section className="container mx-auto px-4 text-center">
        <div className="rounded-3xl border bg-gradient-to-r from-brand-pinkLight via-white to-brand-pinkLight p-8 sm:p-12 shadow-sm">
          <div className="inline-flex p-3 rounded-full bg-white shadow-sm text-brand-purple mb-4">
            <Instagram className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark mb-2">
            Siga @clickmodas_kids no Instagram
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Confira novidades nos stories, vídeos detalhados das peças infantis e fotos de combinações de looks!
          </p>
          <a
            href="https://instagram.com/clickmodas_kids"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-purple text-white hover:bg-brand-purple/90 px-6 py-3 rounded-full text-sm font-semibold shadow transition-all"
          >
            <span>Ver Perfil @clickmodas_kids</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
