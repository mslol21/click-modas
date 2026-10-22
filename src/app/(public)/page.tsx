import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  HeartHandshake,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ShoppingBag,
  Sparkles,
  Shirt,
  Layers,
  Truck,
  ShieldCheck,
  Store,
  Sun,
} from "lucide-react";
import { getBanners, getCategories, getProducts } from "@/lib/data";
import { FeaturedProductsCarousel } from "@/components/product/featured-carousel";
import styles from "./home.module.css";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Click Modas 25 — Moda Infantil do Tamanho 2 ao 16",
  description:
    "Roupas infantis confortáveis para brincar e passear. Catálogo virtual com vestidos, conjuntos e novidades. Atendimento e pedidos diretos no WhatsApp.",
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
    text: "Combinações leves, tecidos frescos e liberdade de movimento para a energia dos pequenos.",
  },
  {
    number: "02",
    icon: Heart,
    title: "Passeios em família",
    text: "Looks arrumadinhos e cheios de personalidade para fotos, festinhas e passeios de fim de semana.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Momentos especiais",
    text: "Vestidos e conjuntos delicados que marcam aniversários e conquistas com encanto e bom gosto.",
  },
];

const categoryShortcuts = [
  {
    name: "Vestidos Infantis",
    slug: "vestidos-infantis",
    desc: "Tamanhos 2 ao 16",
    icon: Sparkles,
    color: "bg-purple-50 text-brand-purple border-purple-100",
  },
  {
    name: "Conjuntos Menina",
    slug: "conjuntos-menina",
    desc: "Conforto e estilo",
    icon: Shirt,
    color: "bg-pink-50 text-brand-pink border-pink-100",
  },
  {
    name: "Conjuntos Menino",
    slug: "conjuntos-menino",
    desc: "Dia a dia e passeio",
    icon: Layers,
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    name: "Linha Bebê",
    slug: "linha-bebe",
    desc: "Toque macio",
    icon: Heart,
    color: "bg-rose-50 text-rose-600 border-rose-100",
  },
];

export default async function HomePage() {
  const [banners, categories, allProducts] = await Promise.all([
    getBanners().catch(() => []),
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);

  const banner = banners.find((item) => item.image_url);
  const featured = allProducts.filter((p) => p.is_featured);
  const showcaseProducts = featured.length >= 3 ? featured : allProducts;

  return (
    <div className={styles.home} id="inicio">
      {/* 1. HERO SECTION — Limpa, profissional e humana */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>MODA INFANTIL • SÃO PAULO</span>
            <h1 id="hero-title">
              Para vestir a infância com <em>conforto e alegria.</em>
            </h1>
            <p>
              Peças feitas para crianças brincarem livremente e estarem sempre bem vestidas. Escolha no nosso
              catálogo virtual e finalize com atendimento atencioso pelo WhatsApp.
            </p>

            <div className={styles.actions}>
              <Link className={styles.primary} href="/catalogo">
                <ShoppingBag size={17} aria-hidden="true" />
                <span>Explorar Catálogo Completo</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                className={styles.secondaryAction}
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone size={16} aria-hidden="true" />
                <span>Falar no WhatsApp</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>

            <div className={styles.heroNote}>
              <span>
                <Ruler size={15} className="text-brand-purple shrink-0" aria-hidden="true" />
                Tamanhos 2 ao 16
              </span>
              <span>
                <Truck size={15} className="text-brand-purple shrink-0" aria-hidden="true" />
                Entrega ou Retirada
              </span>
              <span>
                <Store size={15} className="text-brand-purple shrink-0" aria-hidden="true" />
                Galeria Arco-Íris, SP
              </span>
            </div>
          </div>

          <div className={styles.heroArt}>
            <div className={styles.imageFrame}>
              <Link
                href="/catalogo"
                className="block w-full h-full relative group"
                aria-label="Acessar catálogo de produtos"
              >
                {banner ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.title || "Catálogo de moda infantil Click Modas 25"}
                    fill
                    priority
                    sizes="(max-width: 900px) 92vw, 48vw"
                    className={styles.bannerImage}
                  />
                ) : (
                  <div className={styles.brandArt}>
                    <Image
                      src="/click-modas-logo.svg"
                      alt="Click Modas 25"
                      width={280}
                      height={90}
                      priority
                    />
                    <p>
                      Moda infantil do tamanho 2 ao 16.<br />
                      Confira nosso catálogo virtual completo.
                    </p>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FAIXA DE BENEFÍCIOS REAIS */}
      <div className={styles.ribbon} aria-label="Diferenciais da Click Modas 25">
        <div className={styles.ribbonItem}>
          <Truck size={17} aria-hidden="true" />
          <span>Envios para todo o Brasil • Frete sob consulta</span>
        </div>
        <div className={styles.ribbonItem}>
          <MessageCircle size={17} aria-hidden="true" />
          <span>Atendimento humanizado direto no WhatsApp</span>
        </div>
        <div className={styles.ribbonItem}>
          <Ruler size={17} aria-hidden="true" />
          <span>Modelagens confortáveis do 2 ao 16</span>
        </div>
        <div className={styles.ribbonItem}>
          <ShieldCheck size={17} aria-hidden="true" />
          <span>Fotos reais e transparência total</span>
        </div>
      </div>

      {/* 3. NAVEGAÇÃO POR CATEGORIAS (Ícones profissionais, sem emojis) */}
      <section className="border-b bg-background py-10 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className={styles.eyebrow}>DEPARTAMENTOS</span>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-dark mt-1">
                O que você procura hoje?
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
            >
              <span>Ver catálogo com todos os filtros</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {categoryShortcuts.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="group flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-border/80 hover:border-brand-purple/40 hover:shadow-md transition-all"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${cat.color}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-brand-dark group-hover:text-brand-purple transition-colors truncate">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">{cat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. VITRINE DE DESTAQUES — 1 ÚNICA FILEIRA QUE RODA SOZINHA */}
      {showcaseProducts.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className={styles.eyebrow}>VITRINE CLICK MODAS 25</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1">
                Destaques do Catálogo
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                Peças selecionadas com carinho. A fileira roda automaticamente; passe o cursor para pausar ou
                use as setas.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-brand-purple/90 transition-all shadow-sm shrink-0"
            >
              <ShoppingBag size={14} />
              <span>Ver Todos no Catálogo</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Carrossel de uma única fileira */}
          <FeaturedProductsCarousel products={showcaseProducts} />

          <div className="mt-8 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-pinkLight/80 text-brand-purple hover:bg-brand-pinkLight font-bold text-xs sm:text-sm transition-all shadow-sm"
            >
              <span>Explorar todo o catálogo com busca por SKU e tamanhos</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* 5. NOSSA ESSÊNCIA */}
      <section id="nossa-essencia" className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
        <div>
          <span className={styles.eyebrow}>NOSSA HISTÓRIA</span>
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
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/catalogo" className={styles.primary}>
              <ShoppingBag size={16} />
              <span>Conhecer Catálogo</span>
            </Link>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.secondaryAction}>
              <Phone size={15} />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. NOSSO UNIVERSO */}
      <section id="nosso-universo" className={styles.moments} aria-labelledby="moments-title">
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>PARA CADA FASE</span>
            <h2 id="moments-title">
              Para todos os momentos de <em>ser criança.</em>
            </h2>
            <p>
              Do dia a dia confortável até as ocasiões especiais que merecem um look marcante.
            </p>
          </div>
          <div className={styles.momentGrid}>
            {moments.map(({ number, icon: Icon, title, text }) => (
              <article key={number} className={styles.momentCard}>
                <div className={styles.momentTop}>
                  <div className="w-10 h-10 rounded-xl bg-brand-pinkLight text-brand-purple flex items-center justify-center">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <span>{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          {/* Banner de apoio para o catálogo */}
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-border/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-brand-dark">
                Procurando um tamanho específico do 2 ao 16?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Consulte as peças disponíveis com fotos e descrições detalhadas em nosso catálogo virtual.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="shrink-0 inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-brand-purple/90 transition-all shadow-sm"
            >
              <ShoppingBag size={15} />
              <span>Acessar Catálogo</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. ATENDIMENTO PERSONALIZADO */}
      <section id="atendimento" className={`${styles.section} ${styles.care}`} aria-labelledby="care-title">
        <div className={styles.careIntro}>
          <span className={styles.eyebrow}>ATENDIMENTO HUMANIZADO</span>
          <h2 id="care-title">
            Escolher fica melhor com <em>alguém por perto.</em>
          </h2>
          <p>
            Dúvida sobre o tamanho ou o caimento? Fale diretamente com a proprietária pelo WhatsApp e receba
            fotos e orientações com tranquilidade.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={whatsapp} className={styles.primary} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} aria-hidden="true" />
              <span>Conversar com a Loja</span>
            </a>
            <Link href="/catalogo" className={styles.secondaryAction}>
              <span>Ver Catálogo Primeiro</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className={styles.careItems}>
          {[
            {
              icon: MessageCircle,
              title: "Conversa Direta no WhatsApp",
              text: "Atendimento ágil para tirar dúvidas de estampas, tamanhos e disponibilidade.",
            },
            {
              icon: Ruler,
              title: "Auxílio para Acertar nas Medidas",
              text: "Ajudamos você a conferir a fita métrica antes de finalizar o pedido.",
            },
            {
              icon: Truck,
              title: "Entrega ou Retirada na Loja",
              text: "Combine a forma de envio mais prática e rápida para a sua localidade.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className={styles.careItem}>
              <span>
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
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
            <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
              NOSSO ESPAÇO FÍSICO
            </span>
            <h2 id="visit-title">
              Venha conhecer nosso <em>cantinho.</em>
            </h2>
            <p>
              Será um prazer receber sua família e ajudar a encontrar o próximo look favorito dos pequenos na
              região de São Paulo.
            </p>
          </div>
          <div className={styles.addressCard}>
            <MapPin size={26} strokeWidth={1.75} aria-hidden="true" className="text-pink-300" />
            <h3>Click Modas 25</h3>
            <address>{address}</address>
            <p>Fale com a equipe para confirmar os horários de atendimento antes da visita.</p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={maps} target="_blank" rel="noopener noreferrer" className={styles.primary}>
                <span>Como Chegar</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-pink-200 hover:text-white underline font-semibold ml-2"
              >
                Consultar horário
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REDES SOCIAIS */}
      <section className={styles.social} aria-labelledby="social-title">
        <div className="w-12 h-12 rounded-2xl bg-brand-pinkLight text-brand-purple flex items-center justify-center mx-auto mb-3">
          <Instagram size={24} strokeWidth={1.75} aria-hidden="true" />
        </div>
        <span className={styles.eyebrow}>INSTAGRAM OFICIAL</span>
        <h2 id="social-title">Acompanhe nossas novidades</h2>
        <p>
          Fotos reais das peças, bastidores e combinações de looks para os pequenos. Siga a Click Modas 25 no
          Instagram.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={instagram} className={styles.primary} target="_blank" rel="noopener noreferrer">
            <span>@clickmodas_kids no Instagram</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <Link href="/catalogo" className={styles.secondaryAction}>
            <span>Ir para o Catálogo Virtual</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
