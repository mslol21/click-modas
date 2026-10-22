"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedProductsCarouselProps {
  products: Product[];
}

export function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  // Verifica posição do scroll para atualizar estado dos botões
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Função para avançar 1 card
  const scrollNext = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const card = scrollRef.current.querySelector<HTMLElement>("[data-carousel-item]");
    const step = card ? card.offsetWidth + 20 : 300;

    // Se estiver no final, volta suavemente para o início
    if (scrollLeft + clientWidth >= scrollWidth - 20) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  }, []);

  // Função para voltar 1 card
  const scrollPrev = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const card = scrollRef.current.querySelector<HTMLElement>("[data-carousel-item]");
    const step = card ? card.offsetWidth + 20 : 300;

    if (scrollLeft <= 20) {
      scrollRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  }, []);

  // Auto-scroll contínuo (roda sozinho a cada 3.5 segundos)
  useEffect(() => {
    if (products.length <= 1) return;

    // Respeita preferência do usuário por menos movimento
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (isPaused) return;

    const timer = setInterval(() => {
      scrollNext();
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, products.length, scrollNext]);

  if (!products || products.length === 0) return null;

  return (
    <div
      className="relative w-full group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => {
        setIsPaused(true);
        setUserInteracted(true);
      }}
      onTouchEnd={() => {
        // Retoma após 4s de inatividade no touch
        setTimeout(() => setIsPaused(false), 4000);
      }}
    >
      {/* Controles no topo: Navegação e Indicador de Autoplay */}
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="flex h-2 w-2 relative">
            {!isPaused && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isPaused ? "bg-amber-500" : "bg-brand-purple"
              }`}
            />
          </span>
          <span className="hidden sm:inline">
            {isPaused ? "Carrossel pausado" : "Girando automaticamente"}
          </span>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Retomar rotação automática" : "Pausar rotação automática"}
            className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-brand-purple transition-colors ml-1"
            title={isPaused ? "Play" : "Pausar"}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>

        {/* Setas de navegação manual */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            aria-label="Item anterior"
            className="h-9 w-9 rounded-full border-brand-purple/20 bg-background/80 hover:bg-brand-purple hover:text-white transition-all shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollNext}
            aria-label="Próximo item"
            className="h-9 w-9 rounded-full border-brand-purple/20 bg-background/80 hover:bg-brand-purple hover:text-white transition-all shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Trilho de UMA ÚNICA FILEIRA com scroll suave */}
      <div
        ref={scrollRef}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-2 px-1 focus:outline-none [-webkit-overflow-scrolling:touch] select-none"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-item
            className="w-[240px] sm:w-[270px] lg:w-[290px] shrink-0 transform transition-transform duration-300 hover:-translate-y-1"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Gradientes sutis nas bordas para indicar continuidade */}
      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-12 bottom-2 w-12 bg-gradient-to-r from-background to-transparent z-10 hidden sm:block"
        />
      )}
      {canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-12 bottom-2 w-12 bg-gradient-to-l from-background to-transparent z-10 hidden sm:block"
        />
      )}
    </div>
  );
}
