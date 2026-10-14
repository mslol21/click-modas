"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, Category } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, SlidersHorizontal, PackageOpen } from "lucide-react";

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
  currentSize?: string;
  currentSort?: string;
}

const AVAILABLE_SIZES = ["2", "4", "6", "8", "10", "12", "14", "16", "M", "G"];

export function CatalogClient({
  initialProducts,
  categories,
  currentCategory,
  currentSearch = "",
  currentSize,
  currentSort = "newest",
}: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(currentSearch);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || "all");
  const [selectedSize, setSelectedSize] = useState(currentSize || "all");
  const [selectedSort, setSelectedSort] = useState(currentSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Update URL params
  const applyFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/catalogo?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ busca: search.trim() || null });
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    applyFilters({ categoria: slug === "all" ? null : slug });
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    applyFilters({ tamanho: size === "all" ? null : size });
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    applyFilters({ sort });
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedSort("newest");
    startTransition(() => {
      router.push("/catalogo");
    });
  };

  const hasActiveFilters =
    Boolean(currentCategory) ||
    Boolean(currentSearch) ||
    Boolean(currentSize) ||
    (currentSort && currentSort !== "newest");

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card p-4 rounded-3xl border shadow-sm">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Input
            type="text"
            placeholder="Pesquisar por nome, modelo ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-20 h-11 rounded-full"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1.5 top-1.5 h-8 px-4 rounded-full text-xs"
          >
            Buscar
          </Button>
        </form>

        {/* Sort & Mobile Filters Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="md:hidden flex items-center gap-2 rounded-full h-11"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-purple" />
            <span>Filtros {hasActiveFilters && "•"}</span>
          </Button>

          <div className="w-48 sm:w-56">
            <Select value={selectedSort} onValueChange={handleSortChange}>
              <SelectTrigger className="rounded-full h-11">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="name">Nome (A - Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Sidebar Filters (Desktop) & Collapsible (Mobile) */}
        <aside
          className={`${
            mobileFilterOpen ? "block" : "hidden"
          } md:block md:col-span-1 space-y-6 bg-card p-5 rounded-3xl border shadow-sm`}
        >
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-purple" />
              <h3 className="font-bold text-sm text-brand-dark uppercase tracking-wide">
                Filtros
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-brand-purple hover:underline font-medium"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Categorias
            </h4>
            <div className="space-y-1 text-sm">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium ${
                  selectedCategory === "all"
                    ? "bg-brand-pinkLight text-brand-purple font-bold"
                    : "text-brand-dark hover:bg-muted"
                }`}
              >
                Todas as categorias
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors text-sm ${
                    selectedCategory === cat.slug
                      ? "bg-brand-pinkLight text-brand-purple font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-brand-dark"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter (Tamanhos 2 ao 16) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Tamanho Infantil
              </h4>
              <span className="text-[10px] text-brand-purple font-semibold">2 ao 16</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleSizeChange("all")}
                className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                  selectedSize === "all"
                    ? "bg-brand-purple text-white border-brand-purple"
                    : "bg-muted/40 hover:bg-muted text-brand-dark"
                }`}
              >
                Todos
              </button>
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                    selectedSize === size
                      ? "bg-brand-purple text-white border-brand-purple shadow-sm"
                      : "bg-muted/40 hover:bg-muted text-brand-dark"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Clear Filter CTA */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="w-full rounded-full text-xs gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remover todos os filtros</span>
            </Button>
          )}
        </aside>

        {/* Right Product Grid */}
        <div className="md:col-span-3 space-y-6">
          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-3 rounded-2xl border text-xs">
              <span className="text-muted-foreground font-medium">Filtros ativos:</span>
              {currentCategory && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border shadow-sm font-semibold text-brand-purple">
                  Categoria: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                  <button onClick={() => handleCategoryChange("all")}>
                    <X className="w-3 h-3 text-muted-foreground hover:text-brand-dark" />
                  </button>
                </span>
              )}
              {currentSize && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border shadow-sm font-semibold text-brand-purple">
                  Tamanho: {currentSize}
                  <button onClick={() => handleSizeChange("all")}>
                    <X className="w-3 h-3 text-muted-foreground hover:text-brand-dark" />
                  </button>
                </span>
              )}
              {currentSearch && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border shadow-sm font-semibold text-brand-purple">
                  Busca: &ldquo;{currentSearch}&rdquo;
                  <button onClick={() => applyFilters({ busca: null })}>
                    <X className="w-3 h-3 text-muted-foreground hover:text-brand-dark" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs text-brand-purple hover:underline font-bold ml-auto"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Results count indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Exibindo <strong>{initialProducts.length}</strong> {initialProducts.length === 1 ? "peça" : "peças"} encontrada{initialProducts.length === 1 ? "" : "s"}
            </span>
            {isPending && <span className="text-brand-purple animate-pulse">Atualizando catálogo...</span>}
          </div>

          {/* Product Cards or Empty State */}
          {initialProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {initialProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-3xl border shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-pinkLight text-brand-purple flex items-center justify-center">
                <PackageOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-brand-dark">
                  Nenhum produto encontrado
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Não encontramos peças com os filtros selecionados. Tente buscar por outros termos ou limpar os filtros.
                </p>
              </div>
              <Button
                variant="default"
                onClick={handleClearFilters}
                className="rounded-full text-xs"
              >
                Ver todos os produtos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
