"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, Search, Menu, X, Phone, Instagram, Sparkles } from "lucide-react";
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
      {/* Top Notification Bar */}
      <div className="bg-brand-pinkLight py-2 px-4 text-center text-xs sm:text-sm font-medium text-brand-purple flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
        <span>Moda Infantil do <strong>Tamanho 2 ao 16</strong> • Atendimento e Pedidos pelo WhatsApp!</span>
        <a
          href="https://wa.me/5511954686239"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-brand-dark transition-colors hidden md:inline ml-1"
        >
          (11) 95468-6239
        </a>
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-dark rounded-xl hover:bg-brand-pinkLight transition-colors"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-brand-dark rounded-xl hover:bg-brand-pinkLight transition-colors"
            aria-label="Buscar produtos"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Logo */}
        <Link href="/" className="flex flex-col items-center sm:items-start group">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-brand-purple group-hover:opacity-90 transition-opacity">
              CLICK MODAS
            </span>
            <span className="bg-brand-pink text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              25
            </span>
          </div>
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-medium">
            Moda Infantil • 2 ao 16
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-brand-dark hover:text-brand-purple transition-colors">
            Início
          </Link>
          <Link href="/catalogo" className="text-brand-dark hover:text-brand-purple transition-colors">
            Catálogo Completo
          </Link>
          <Link href="/catalogo?categoria=vestidos-infantis" className="text-brand-dark hover:text-brand-purple transition-colors">
            Vestidos
          </Link>
          <Link href="/catalogo?categoria=conjuntos-menina" className="text-brand-dark hover:text-brand-purple transition-colors">
            Conjuntos Menina
          </Link>
          <Link href="/catalogo?categoria=conjuntos-menino" className="text-brand-dark hover:text-brand-purple transition-colors">
            Conjuntos Menino
          </Link>
          <Link href="/guia-de-medidas" className="text-brand-dark hover:text-brand-purple transition-colors">
            Guia de Medidas
          </Link>
          <Link href="/sobre" className="text-brand-dark hover:text-brand-purple transition-colors">
            Sobre Nós
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center max-w-xs w-full">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Buscar por peça, cor ou SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-full bg-muted/70 text-xs focus:bg-background border border-transparent focus:border-brand-lilac outline-none transition-all placeholder:text-muted-foreground"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
          </form>
        </div>

        {/* Actions (WhatsApp & Cart) */}
        <div className="flex items-center space-x-3">
          <a
            href="https://instagram.com/clickmodas_kids"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex p-2.5 rounded-full hover:bg-brand-pinkLight text-brand-purple transition-colors"
            title="Instagram @clickmodas_kids"
          >
            <Instagram className="w-5 h-5" />
          </a>

          <a
            href="https://wa.me/5511954686239"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>(11) 95468-6239</span>
          </a>

          <Link href="/carrinho">
            <Button variant="default" size="default" className="relative gap-2 px-4 rounded-full shadow-sm">
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
              placeholder="Digite o que procura (ex: vestido, camisa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-full bg-muted text-sm border focus:border-brand-purple outline-none"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background py-4 px-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 font-medium text-base">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Início
            </Link>
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Catálogo Completo
            </Link>
            <Link
              href="/catalogo?categoria=vestidos-infantis"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Vestidos Infantis
            </Link>
            <Link
              href="/catalogo?categoria=conjuntos-menina"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Conjuntos Menina
            </Link>
            <Link
              href="/catalogo?categoria=conjuntos-menino"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Conjuntos Menino
            </Link>
            <Link
              href="/catalogo?categoria=linha-bebe"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Linha Bebê
            </Link>
            <Link
              href="/guia-de-medidas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Guia de Medidas (2 a 16)
            </Link>
            <Link
              href="/sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Sobre a Loja
            </Link>
            <Link
              href="/contato"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brand-dark hover:text-brand-purple"
            >
              Fale Conosco
            </Link>
          </nav>

          <div className="pt-4 border-t flex flex-col gap-2">
            <a
              href="https://wa.me/5511954686239"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700"
            >
              <Phone className="w-4 h-4" />
              <span>Chamar no WhatsApp: (11) 95468-6239</span>
            </a>
            <a
              href="https://instagram.com/clickmodas_kids"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-brand-pinkLight text-brand-purple font-semibold text-sm hover:bg-brand-pink/30"
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
