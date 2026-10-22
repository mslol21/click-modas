"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  Instagram,
  Truck,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?busca=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all">
      {/* Top Notification Bar — Clean, trust-building retail bar */}
      <div className="bg-brand-pinkLight/60 border-b border-brand-pinkLight py-2 px-4 text-center text-xs font-medium text-brand-dark flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5 text-brand-purple shrink-0" />
        <span>Moda Infantil do <strong>Tamanho 2 ao 16</strong> • Entregamos para todo o Brasil • Pedidos pelo WhatsApp</span>
        <a
          href="https://wa.me/5511954686239"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-purple font-semibold hover:underline hidden md:inline ml-1"
        >
          (11) 95468-6239
        </a>
      </div>

      <div className="container mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between gap-3 lg:gap-6">
        {/* Mobile Menu & Search Buttons */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-brand-dark rounded-xl hover:bg-muted transition-colors"
            aria-label={mobileMenuOpen ? "Fechar Menu" : "Abrir Menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 text-brand-dark rounded-xl hover:bg-muted transition-colors"
            aria-label="Buscar produtos"
          >
            <Search className="w-5 h-5 text-brand-dark" />
          </button>
        </div>

        {/* Identidade visual da Click Modas 25 */}
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-purple"
          aria-label="Click Modas 25 — Página Inicial"
        >
          <Image
            src="/click-modas-logo.svg"
            alt="Click Modas 25"
            width={170}
            height={56}
            className="h-11 w-auto max-w-[140px] object-contain sm:h-13 sm:max-w-[170px]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">
          <Link
            href="/"
            className="text-brand-dark/80 hover:text-brand-purple transition-colors text-xs xl:text-sm"
          >
            Início
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 bg-brand-purple text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-brand-purple/90 shadow-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Catálogo Completo</span>
          </Link>
          <Link
            href="/catalogo?categoria=vestidos-infantis"
            className="text-brand-dark/80 hover:text-brand-purple transition-colors text-xs xl:text-sm"
          >
            Vestidos
          </Link>
          <Link
            href="/catalogo?categoria=conjuntos-menina"
            className="text-brand-dark/80 hover:text-brand-purple transition-colors text-xs xl:text-sm"
          >
            Conjuntos Menina
          </Link>
          <Link
            href="/catalogo?categoria=conjuntos-menino"
            className="text-brand-dark/80 hover:text-brand-purple transition-colors text-xs xl:text-sm"
          >
            Conjuntos Menino
          </Link>
          <Link
            href="/guia-de-medidas"
            className="text-brand-dark/80 hover:text-brand-purple transition-colors text-xs xl:text-sm"
          >
            Guia de Medidas
          </Link>
          <Link
            href="/sobre"
            className="text-brand-dark/80 hover:text-brand-purple transition-colors text-xs xl:text-sm"
          >
            Sobre Nós
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center max-w-[210px] xl:max-w-[240px] w-full">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Buscar no catálogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-full bg-muted/60 text-xs focus:bg-background border border-transparent focus:border-brand-purple/40 outline-none transition-all placeholder:text-muted-foreground"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
          </form>
        </div>

        {/* Actions (WhatsApp & Cart) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="https://instagram.com/clickmodas_kids"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex p-2 rounded-full hover:bg-muted text-brand-dark/70 hover:text-brand-purple transition-colors"
            title="Instagram @clickmodas_kids"
            aria-label="Instagram da Click Modas 25"
          >
            <Instagram className="w-5 h-5" />
          </a>

          <a
            href="https://wa.me/5511954686239"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors border border-emerald-200/80"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>(11) 95468-6239</span>
          </a>

          <Link href="/carrinho" aria-label={`Sacola com ${totalItems} itens`}>
            <Button
              variant="default"
              size="default"
              className="relative gap-2 px-3.5 sm:px-4 rounded-full shadow-sm bg-brand-purple hover:bg-brand-purple/90"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold">Sacola</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-pink text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-background animate-in zoom-in-50">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {searchOpen && (
        <div className="lg:hidden p-4 border-t bg-background animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              autoFocus
              placeholder="Digite o modelo, tamanho ou cor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-full bg-muted text-sm border focus:border-brand-purple outline-none"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu — Clean and professional */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background py-5 px-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <nav className="flex flex-col space-y-1 font-medium text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-muted text-brand-dark flex items-center justify-between"
            >
              <span>Início</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 rounded-2xl bg-brand-purple text-white font-semibold flex items-center justify-between shadow-sm my-1"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Ver Catálogo Completo</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/catalogo?categoria=vestidos-infantis"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-muted text-brand-dark flex items-center justify-between"
            >
              <span>Vestidos Infantis</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/catalogo?categoria=conjuntos-menina"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-muted text-brand-dark flex items-center justify-between"
            >
              <span>Conjuntos Menina</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/catalogo?categoria=conjuntos-menino"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-muted text-brand-dark flex items-center justify-between"
            >
              <span>Conjuntos Menino</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/catalogo?categoria=linha-bebe"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-muted text-brand-dark flex items-center justify-between"
            >
              <span>Linha Bebê</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/guia-de-medidas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-muted text-brand-dark flex items-center justify-between"
            >
              <span>Tabela & Guia de Medidas (2 a 16)</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-muted text-brand-dark flex items-center justify-between"
            >
              <span>Sobre a Loja</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-muted text-brand-dark flex items-center justify-between"
            >
              <span>Fale Conosco</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </nav>

          <div className="pt-3 border-t flex flex-col gap-2">
            <a
              href="https://wa.me/5511954686239"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Chamar no WhatsApp: (11) 95468-6239</span>
            </a>
            <a
              href="https://instagram.com/clickmodas_kids"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-brand-pinkLight/80 text-brand-purple font-semibold text-xs hover:bg-brand-pinkLight"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram @clickmodas_kids</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
