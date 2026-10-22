import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Heart,
  HeartHandshake,
  Instagram,
  MapPin,
  MessageCircle,
  Ruler,
  ShoppingBag,
  Sparkles,
  Sun,
  Shirt,
} from "lucide-react";
import { getBanners, getCategories, getProducts } from "@/lib/data";
import { FeaturedProductsCarousel } from "@/components/product/featured-carousel";
import styles from "./home.module.css";
import { HomeAtmosphere } from "./home-atmosphere";
import { HomeButterflies } from "./home-butterflies";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Click Modas 25 — E-commerce & Catálogo de Moda Infantil",
  description:
    "Moda infantil delicada e confortável do tamanho 2 ao 16. Confira nosso catálogo completo com vestidos, conjuntos e novidades. Pedidos diretos pelo WhatsApp.",
};

const whatsapp =
  "https://wa.me/5511954686239?text=" +
  encodeURIComponent("Olá! Conheci a Click Modas 25 pelo site e gostaria de saber mais sobre as roupas infantis.");
const instagram = "https://www.instagram.com/clickmodas_kids/";
const address = "Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP";
const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);

const moments = [
  {
    number: "01",
    icon: Sun,
    title: "Dias de brincar",
    text: "Combinações leves e descontraídas para acompanhar a energia de quem tem um mundo inteiro para descobrir.",
    color: "peach",
  },
  {
    number: "02",
    icon: Heart,
    title: "Passeios em família",
    text: "Aquele look cheio de personalidade para um domingo especial, uma visita ou uma nova aventura juntos.",
    color: "lilac",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Momentos especiais",
    text: "Delicadeza e encanto para celebrar aniversários, encontros e as pequenas grandes conquistas da infância.",
    color: "mint",
  },
];

const categoryShortcuts = [
  {
    name: "Vestidos Infantis",
    slug: "vestidos-infantis",
    emoji: "👗",
    desc: "Tamanhos 2 ao 16",
  },
  {
    name: "Conjuntos Menina",
    slug: "conjuntos-menina",
    emoji: "👚",
    desc: "Looks confortáveis",
  },
  {
    name: "Conjuntos Menino",
    slug: "conjuntos-menino",
    emoji: "👕",
    desc: "Estilo & liberdade",
  },
  {
    name: "Linha Bebê",
    slug: "linha-bebe",
    emoji: "👶",
    desc: "Toque macio",
  },
];

export default async function HomePage() {
  const [banners, categories, allProducts] = await Promise.all([
    getBanners().catch(() => []),
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);

  const banner = banners.find((item) => item.image_url);
  // Prioriza produtos em destaque, se houver, ou usa todos os produtos cadastrados
  const featured = allProducts.filter((p) => p.is_featured);
  const showcaseProducts = featured.length >= 3 ? featured : allProducts;

  return (
    <HomeAtmosphere>
      {/* 1. HERO SECTION COM LINK DIRETO PARA O CATÁLOGO */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.colorClouds} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <HomeButterflies />
        <div className={styles.heroInner}>
          <div
            className={`${styles.heroCopy} motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700`}
          >
            <span className={styles.eyebrow}>
              <span /> PEQUENOS LOOKS. GRANDES HISTÓRIAS.
            </span>
            <h1 id="hero-title">
              Para vestir a infância de <em>alegria.</em>
            </h1>
            <p>
              Roupas para brincar, descobrir e criar memórias. Conheça o catálogo completo da Click Modas 25
              e encontre carinho em cada detalhe da moda infantil.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/catalogo">
                Ver Catálogo Completo <ArrowRight size={19} aria-hidden="true" />
              </Link>
              <a
                className={styles.textLink}
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Comprar pelo WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <div className={styles.heroNote}>
              <Heart size={17} aria-hidden="true" /> Moda infantil · Tamanhos 2 ao 16 · Peças a partir de R$ 25
            </div>
          </div>

          <div
            className={`${styles.heroArt} motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-1000`}
          >
            <span className={styles.artLabel}>CLIQUE PARA EXPLORAR O CATÁLOGO</span>
            <div className={styles.imageFrame}>
              <Link href="/catalogo" className="block w-full h-full relative" aria-label="Acessar catálogo de produtos">
                {banner ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.title || "Catálogo de moda infantil Click Modas 25"}
                    fill
                    priority
                    sizes="(max-width: 800px) 92vw, 48vw"
                    className={styles.bannerImage}
                  />
                ) : (
                  <div className={styles.brandArt}>
                    <div className={styles.rainbow} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <Image src="/click-modas-logo.svg" alt="Click Modas 25" width={300} height={100} priority />
                    <p>
                      Conheça nosso catálogo.<br />Uma infância cheia de cor.
                    </p>
                  </div>
                )}
              </Link>
            </div>
            <Link href="/catalogo" className={styles.artBadge}>
              <ShoppingBag size={22} aria-hidden="true" />
              <span>
                Catálogo Disponível.<br />
                <strong>Clique e veja as peças.</strong>
              </span>
            </Link>
            <span className={styles.artSpark} aria-hidden="true">
              ✳
            </span>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE DEPARTAMENTOS RÁPIDOS */}
      <section className="border-y bg-background/90 py-6 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                Navegue pelas Categorias
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">
                O que você procura hoje?
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
            >
              <span>Ver catálogo com filtros completos</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {categoryShortcuts.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo?categoria=${cat.slug}`}
                className="group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-brand-pinkLight hover:border-brand-lilac hover:shadow-md transition-all"
              >
                <span className="text-2xl sm:text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-brand-dark group-hover:text-brand-purple transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VITRINE DE PRODUTOS EM DESTAQUE — EM UMA ÚNICA FILEIRA QUE RODA SOZINHA */}
      {showcaseProducts.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                Vitrine Click Modas 25
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1">
                Destaques do Nosso Catálogo
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                Looks infantis selecionados com carinho, do tamanho 2 ao 16. A fileira roda automaticamente; passe o mouse para pausar ou navegue com as setas.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-brand-purple/90 transition-all shadow-sm shrink-0"
            >
              <Shirt size={15} />
              <span>Ver Todos no Catálogo</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Carrossel em 1 única fileira com autoplay contínuo */}
          <FeaturedProductsCarousel products={showcaseProducts} />

          <div className="mt-8 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-pinkLight text-brand-purple hover:bg-brand-pink/20 font-bold text-sm transition-all shadow-sm"
            >
              <span>Explorar todo o catálogo com busca e filtros</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* 4. FAIXA COLORIDA INSTITUCIONAL */}
      <div className={styles.ribbon} aria-label="O universo da Click Modas">
        <span>Mais cor para os dias</span>
        <span aria-hidden="true">✳</span>
        <span>Mais liberdade para brincar</span>
        <span aria-hidden="true">✳</span>
        <span>Mais histórias para viver</span>
      </div>

      {/* 5. NOSSA ESSÊNCIA */}
      <section id="nossa-essencia" className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
        <div>
          <span className={styles.eyebrow}>OLÁ, SOMOS A CLICK MODAS 25</span>
          <h2 id="about-title">
            A infância passa rápido.<br />
            <em>O carinho fica.</em>
          </h2>
        </div>
        <div className={styles.aboutText}>
          <p>
            Tem roupa que acompanha o primeiro passeio. Outras viram favoritas para brincar. E tem aquele look
            que fica para sempre na foto de família.
          </p>
          <p>
            É para fazer parte desses momentos que a Click Modas 25 existe: uma loja de moda infantil com peças
            para meninas e meninos, do tamanho 2 ao 16, e uma conversa próxima com cada família.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link href="/catalogo" className={styles.primary}>
              Ver Modelos no Catálogo <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
              Fale Conosco pelo WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. NOSSO UNIVERSO & MOMENTOS */}
      <section id="nosso-universo" className={styles.moments} aria-labelledby="moments-title">
        <HomeButterflies variant="garden" />
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>CADA FASE, UMA NOVA DESCOBERTA</span>
              <h2 id="moments-title">
                Para todos os jeitos<br />
                de <em>ser criança.</em>
              </h2>
            </div>
            <p>
              Do dia a dia às ocasiões que merecem uma foto. Um universo de possibilidades para acompanhar os
              pequenos.
            </p>
          </div>
          <div className={styles.momentGrid}>
            {moments.map(({ number, icon: Icon, title, text, color }) => (
              <article key={number} className={`${styles.momentCard} ${styles[color]}`}>
                <div className={styles.momentTop}>
                  <Icon size={36} strokeWidth={1.3} aria-hidden="true" />
                  <span>{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          {/* Chamada em destaque para o catálogo */}
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white/90 border border-brand-lilac/30 shadow-sm text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="font-bold text-lg text-brand-dark">Procurando um tamanho ou modelo específico?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Filtre por tamanho (2 ao 16), categoria e faixa de preço em nosso catálogo virtual completo.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="shrink-0 inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-brand-purple/90 transition-all shadow-md"
            >
              <Shirt size={16} />
              <span>Acessar Catálogo Completo</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. ATENDIMENTO */}
      <section id="atendimento" className={`${styles.section} ${styles.care}`} aria-labelledby="care-title">
        <div className={styles.careIntro}>
          <span className={styles.eyebrow}>DE FAMÍLIA PARA FAMÍLIA</span>
          <h2 id="care-title">
            Escolher fica melhor<br />
            com alguém <em>por perto.</em>
          </h2>
          <p>
            Uma dúvida sobre o tamanho? Procurando uma combinação? Fale com a gente e escolha com mais tranquilidade.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={whatsapp} className={styles.primary} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={19} aria-hidden="true" /> Conversar com a loja
            </a>
            <Link href="/catalogo" className={styles.textLink}>
              Ver Catálogo Primeiro <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className={styles.careItems}>
          {[
            {
              icon: HeartHandshake,
              title: "Uma conversa de verdade",
              text: "Atendimento direto pelo WhatsApp para conhecer as opções e tirar suas dúvidas.",
            },
            {
              icon: Ruler,
              title: "Ajuda para acertar na escolha",
              text: "Consulte as medidas e os tamanhos disponíveis antes de decidir o look.",
            },
            {
              icon: MapPin,
              title: "Do seu jeito, pertinho de você",
              text: "Visite a loja ou consulte com nossa equipe as possibilidades de entrega e retirada.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className={styles.careItem}>
              <span>
                <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. VISITE A LOJA */}
      <section id="visite" className={styles.visit} aria-labelledby="visit-title">
        <div className={`${styles.section} ${styles.visitInner}`}>
          <div>
            <span className={styles.eyebrow}>UM CONVITE PARA VOCÊ</span>
            <h2 id="visit-title">
              Venha conhecer<br />
              nosso <em>cantinho.</em>
            </h2>
            <p>
              Será um prazer receber sua família e ajudar a encontrar o próximo look favorito dos pequenos.
            </p>
          </div>
          <div className={styles.addressCard}>
            <MapPin size={29} strokeWidth={1.5} aria-hidden="true" />
            <h3>Click Modas 25</h3>
            <address>{address}</address>
            <p>Fale com a equipe para confirmar os horários de atendimento antes da visita.</p>
            <a href={maps} target="_blank" rel="noopener noreferrer" className={styles.primary}>
              Como chegar <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
              Consultar horário de atendimento
            </a>
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM & REDES */}
      <section className={`${styles.section} ${styles.social}`} aria-labelledby="social-title">
        <HomeButterflies variant="social" />
        <Instagram size={32} strokeWidth={1.4} aria-hidden="true" />
        <span className={styles.eyebrow}>NOSSO DIA A DIA TEM MAIS COR</span>
        <h2 id="social-title">
          Vamos continuar<br />
          essa história?
        </h2>
        <p>
          Inspirações, novidades e um pouquinho do nosso universo infantil. Encontre a Click Modas 25 no
          Instagram.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href={instagram} className={styles.primary} target="_blank" rel="noopener noreferrer">
            @clickmodas_kids <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline">
            <span>Explorar catálogo completo de produtos</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </HomeAtmosphere>
  );
}
