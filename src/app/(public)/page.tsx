import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Heart, HeartHandshake, Instagram, MapPin, MessageCircle, Ruler, Sparkles, Sun } from "lucide-react";
import { getBanners } from "@/lib/data";
import styles from "./home.module.css";
import { HomeAtmosphere } from "./home-atmosphere";
import { HomeButterflies } from "./home-butterflies";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Click Modas 25 — Para vestir a infância de alegria",
  description: "Conheça a Click Modas 25: moda infantil do tamanho 2 ao 16, atendimento próximo e looks para acompanhar cada descoberta. Visite nossa loja em São Paulo ou fale pelo WhatsApp.",
};

const whatsapp = "https://wa.me/5511954686239?text=" + encodeURIComponent("Olá! Conheci a Click Modas 25 pelo site e gostaria de saber mais sobre as roupas infantis.");
const instagram = "https://www.instagram.com/clickmodas_kids/";
const address = "Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP";
const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
const moments = [
  { number: "01", icon: Sun, title: "Dias de brincar", text: "Combinações leves e descontraídas para acompanhar a energia de quem tem um mundo inteiro para descobrir.", color: "peach" },
  { number: "02", icon: Heart, title: "Passeios em família", text: "Aquele look cheio de personalidade para um domingo especial, uma visita ou uma nova aventura juntos.", color: "lilac" },
  { number: "03", icon: Sparkles, title: "Momentos especiais", text: "Delicadeza e encanto para celebrar aniversários, encontros e as pequenas grandes conquistas da infância.", color: "mint" },
];

export default async function HomePage() {
  // The institutional page remains available when the optional banner service is unavailable.
  const banners = await getBanners().catch((error: unknown) => {
    console.error("Não foi possível carregar o banner da home:", error instanceof Error ? error.message : error);
    return [];
  });
  const banner = banners.find((item) => item.image_url);

  return (
    <HomeAtmosphere>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.colorClouds} aria-hidden="true"><span /><span /><span /></div>
        <HomeButterflies />
        <div className={styles.heroInner}>
          <div className={`${styles.heroCopy} motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700`}>
            <span className={styles.eyebrow}><span /> PEQUENOS LOOKS. GRANDES HISTÓRIAS.</span>
            <h1 id="hero-title">Para vestir a infância de <em>alegria.</em></h1>
            <p>Roupas para brincar, descobrir e criar memórias. Conheça a Click Modas 25 e encontre carinho em cada detalhe da moda infantil.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href={whatsapp} target="_blank" rel="noopener noreferrer">Vamos escolher um look? <ArrowUpRight size={19} aria-hidden="true" /></a>
              <a className={styles.textLink} href="#nossa-essencia">Conheça nossa loja <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
            <div className={styles.heroNote}><Heart size={17} aria-hidden="true" /> Moda infantil · Tamanhos 2 ao 16 · São Paulo</div>
          </div>
          <div className={`${styles.heroArt} motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-1000`}>
            <span className={styles.artLabel}>O MELHOR LOOK É SER CRIANÇA</span>
            <div className={styles.imageFrame}>
              {banner ? <Image src={banner.image_url} alt={banner.title || "Universo infantil Click Modas 25"} fill priority sizes="(max-width: 800px) 92vw, 48vw" className={styles.bannerImage} /> : <div className={styles.brandArt}><div className={styles.rainbow} aria-hidden="true"><span /><span /><span /></div><Image src="/click-modas-logo.svg" alt="Click Modas 25" width={300} height={100} priority /><p>Um mundo de possibilidades.<br />Uma infância cheia de cor.</p></div>}
            </div>
            <div className={styles.artBadge}><Heart size={23} aria-hidden="true" /><span>Feito de carinho.<br /><strong>Vestido de infância.</strong></span></div>
            <span className={styles.artSpark} aria-hidden="true">✳</span>
          </div>
        </div>
      </section>

      <div className={styles.ribbon} aria-label="O universo da Click Modas"><span>Mais cor para os dias</span><span aria-hidden="true">✳</span><span>Mais liberdade para brincar</span><span aria-hidden="true">✳</span><span>Mais histórias para viver</span></div>

      <section id="nossa-essencia" className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
        <div><span className={styles.eyebrow}>OLÁ, SOMOS A CLICK MODAS 25</span><h2 id="about-title">A infância passa rápido.<br /><em>O carinho fica.</em></h2></div>
        <div className={styles.aboutText}><p>Tem roupa que acompanha o primeiro passeio. Outras viram favoritas para brincar. E tem aquele look que fica para sempre na foto de família.</p><p>É para fazer parte desses momentos que a Click Modas 25 existe: uma loja de moda infantil com peças para meninas e meninos, do tamanho 2 ao 16, e uma conversa próxima com cada família.</p><a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Conte para a gente o que você procura <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </section>

      <section id="nosso-universo" className={styles.moments} aria-labelledby="moments-title"><HomeButterflies variant="garden" /><div className={styles.section}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>CADA FASE, UMA NOVA DESCOBERTA</span><h2 id="moments-title">Para todos os jeitos<br />de <em>ser criança.</em></h2></div><p>Do dia a dia às ocasiões que merecem uma foto. Um universo de possibilidades para acompanhar os pequenos.</p></div>
        <div className={styles.momentGrid}>{moments.map(({ number, icon: Icon, title, text, color }) => <article key={number} className={`${styles.momentCard} ${styles[color]}`}><div className={styles.momentTop}><Icon size={36} strokeWidth={1.3} aria-hidden="true" /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
        <p className={styles.collectionNote}>Quer conhecer as peças disponíveis? <Link href="/catalogo">Explore nossa coleção <ArrowUpRight size={16} aria-hidden="true" /></Link></p>
      </div></section>

      <section id="atendimento" className={`${styles.section} ${styles.care}`} aria-labelledby="care-title">
        <div className={styles.careIntro}><span className={styles.eyebrow}>DE FAMÍLIA PARA FAMÍLIA</span><h2 id="care-title">Escolher fica melhor<br />com alguém <em>por perto.</em></h2><p>Uma dúvida sobre o tamanho? Procurando uma combinação? Fale com a gente e escolha com mais tranquilidade.</p><a href={whatsapp} className={styles.primary} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} aria-hidden="true" /> Conversar com a loja</a></div>
        <div className={styles.careItems}>{[
          { icon: HeartHandshake, title: "Uma conversa de verdade", text: "Atendimento direto pelo WhatsApp para conhecer as opções e tirar suas dúvidas." },
          { icon: Ruler, title: "Ajuda para acertar na escolha", text: "Consulte as medidas e os tamanhos disponíveis antes de decidir o look." },
          { icon: MapPin, title: "Do seu jeito, pertinho de você", text: "Visite a loja ou consulte com nossa equipe as possibilidades de entrega e retirada." },
        ].map(({ icon: Icon, title, text }) => <div key={title} className={styles.careItem}><span><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>
      </section>

      <section id="visite" className={styles.visit} aria-labelledby="visit-title"><div className={`${styles.section} ${styles.visitInner}`}><div><span className={styles.eyebrow}>UM CONVITE PARA VOCÊ</span><h2 id="visit-title">Venha conhecer<br />nosso <em>cantinho.</em></h2><p>Será um prazer receber sua família e ajudar a encontrar o próximo look favorito dos pequenos.</p></div><div className={styles.addressCard}><MapPin size={29} strokeWidth={1.5} aria-hidden="true" /><h3>Click Modas 25</h3><address>{address}</address><p>Fale com a equipe para confirmar os horários de atendimento antes da visita.</p><a href={maps} target="_blank" rel="noopener noreferrer" className={styles.primary}>Como chegar <ArrowUpRight size={18} aria-hidden="true" /></a><a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Consultar horário de atendimento</a></div></div></section>

      <section className={`${styles.section} ${styles.social}`} aria-labelledby="social-title"><HomeButterflies variant="social" /><Instagram size={32} strokeWidth={1.4} aria-hidden="true" /><span className={styles.eyebrow}>NOSSO DIA A DIA TEM MAIS COR</span><h2 id="social-title">Vamos continuar<br />essa história?</h2><p>Inspirações, novidades e um pouquinho do nosso universo infantil. Encontre a Click Modas 25 no Instagram.</p><a href={instagram} className={styles.primary} target="_blank" rel="noopener noreferrer">@clickmodas_kids <ArrowUpRight size={18} aria-hidden="true" /></a></section>
    </HomeAtmosphere>
  );
}
