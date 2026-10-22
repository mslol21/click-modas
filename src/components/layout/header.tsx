"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, Search, Menu, X, Phone, Instagram, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
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

  if (pathname === "/") return <HomeHeader />;

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

      <div className="container mx-auto px-3 sm:px-5 min-h-20 flex items-center justify-between gap-2 lg:gap-4">
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

        {/* Identidade visual da Click Modas 25 */}
        <Link href="/" className="flex shrink-0 items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-purple" aria-label="Click Modas 25 — página inicial">
          <Image src="/click-modas-logo.svg" alt="Click Modas 25" width={180} height={60} className="h-12 w-auto max-w-[145px] object-contain sm:h-14 sm:max-w-[180px]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4 text-sm font-medium">
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
        <div className="hidden xl:flex items-center max-w-[220px] w-full">
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


function HomeHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/#nossa-essencia", label: "Nossa essência" },
    { href: "/#nosso-universo", label: "Nosso universo" },
    { href: "/#atendimento", label: "Atendimento" },
    { href: "/#visite", label: "Visite a loja" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-[#e9e0e8] bg-[#fffcf8]/95 backdrop-blur-md">
      <a href="#inicio" className="sr-only focus:not-sr-only focus:block focus:p-3">Ir para o conteúdo</a>
      <div className="bg-[#e9e1ef] px-4 py-2 text-center text-[10px] font-medium tracking-wide text-[#59436a] sm:text-xs">Uma infância cheia de cor. Moda infantil do tamanho 2 ao 16.</div>
      <div className="mx-auto flex min-h-[84px] max-w-[1200px] items-center justify-between gap-5 px-6">
        <Link href="/" aria-label="Click Modas 25 — Início"><Image src="/click-modas-logo.svg" alt="Click Modas 25" width={165} height={55} priority className="h-auto w-[140px] sm:w-[165px]" /></Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-xs font-medium text-[#51425c] lg:flex">{links.map(link => <a key={link.href} href={link.href} className="py-3 hover:text-brand-purple hover:underline underline-offset-4">{link.label}</a>)}</nav>
        <a href="https://wa.me/5511954686239" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-full border border-[#68418b] px-5 py-3 text-xs font-semibold text-[#68418b] transition-colors hover:bg-[#efe7f2] lg:flex"><Phone size={15} aria-hidden="true" /> Fale com a gente</a>
        <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="home-mobile-nav" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4d9e8] text-[#68418b] lg:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && <nav id="home-mobile-nav" aria-label="Navegação móvel" className="border-t bg-[#fffcf8] px-6 pb-5 lg:hidden">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block border-b border-[#efe7f2] py-4 text-sm">{link.label}</a>)}<a href="https://wa.me/5511954686239" target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#68418b] px-4 py-3 text-sm text-white"><Phone size={16} aria-hidden="true" /> Falar pelo WhatsApp</a></nav>}
    </header>
  );
}
