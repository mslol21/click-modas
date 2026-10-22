"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Product } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedProductsCarouselProps {
  products: Product[];
}

export function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Monitora o scroll para habilitar/desabilitar botões
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

  // Avança 1 card
  const scrollNext = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const card = scrollRef.current.querySelector<HTMLElement>("[data-carousel-item]");
    const step = card ? card.offsetWidth + 20 : 300;

    if (scrollLeft + clientWidth >= scrollWidth - 20) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  }, []);

  // Volta 1 card
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

  // Roda sozinho a cada 3.5 segundos com pausa automática ao interagir
  useEffect(() => {
    if (products.length <= 1) return;

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
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        setTimeout(() => setIsPaused(false), 3000);
      }}
    >
      {/* Barra superior de controle discreta e profissional */}
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
              isPaused ? "bg-amber-400" : "bg-brand-purple"
            }`}
          />
          <span className="hidden sm:inline">
            {isPaused ? "Pausado (passe o cursor para escolher)" : "Rotação contínua automática"}
          </span>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Iniciar rotação automática" : "Pausar rotação automática"}
            className="p-1 rounded-md text-muted-foreground hover:text-brand-purple hover:bg-muted transition-colors ml-0.5"
            title={isPaused ? "Retomar" : "Pausar"}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        </div>

        {/* Setas de navegação manual limpas */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            aria-label="Item anterior"
            className="h-8 w-8 rounded-full border border-border/80 bg-background hover:bg-brand-purple hover:text-white hover:border-brand-purple transition-all shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollNext}
            aria-label="Próximo item"
            className="h-8 w-8 rounded-full border border-border/80 bg-background hover:bg-brand-purple hover:text-white hover:border-brand-purple transition-all shadow-sm"
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
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth py-2 px-1 focus:outline-none [-webkit-overflow-scrolling:touch] select-none"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-item
            className="w-[235px] sm:w-[260px] lg:w-[280px] shrink-0 transform transition-transform duration-200 hover:-translate-y-0.5"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Suave sombra de fade nas pontas */}
      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-12 bottom-2 w-8 bg-gradient-to-r from-background to-transparent z-10 hidden sm:block"
        />
      )}
      {canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-12 bottom-2 w-8 bg-gradient-to-l from-background to-transparent z-10 hidden sm:block"
        />
      )}
    </div>
  );
}
