import React from "react";
import { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { CatalogClient } from "./catalog-client";

interface CatalogPageProps {
  searchParams: {
    categoria?: string;
    busca?: string;
    tamanho?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "name";
  };
}

export function generateMetadata({ searchParams }: CatalogPageProps): Metadata {
  const category = searchParams.categoria;
  const query = searchParams.busca;

  let title = "Catálogo de Moda Infantil";
  if (category) {
    title = `${category.replace(/-/g, " ")} | Moda Infantil Click Modas 25`;
  } else if (query) {
    title = `Busca por "${query}" | Catálogo Click Modas 25`;
  }

  return {
    title,
    description:
      "Explore nosso catálogo completo de moda infantil dos tamanhos 2 ao 16. Vestidos, conjuntos, peças exclusivas e pronta entrega com atendimento no WhatsApp.",
  };
}

export const revalidate = 60;

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const categories = await getCategories();

  const products = await getProducts({
    categorySlug: searchParams.categoria,
    search: searchParams.busca,
    size: searchParams.tamanho,
    sort: searchParams.sort,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb / Title */}
      <div className="mb-6 space-y-1">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Click Modas 25 / Catálogo
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
          {searchParams.categoria
            ? categories.find((c) => c.slug === searchParams.categoria)?.name || "Catálogo de Roupas"
            : "Catálogo Completo de Moda Infantil"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Peças confortáveis e delicadas para crianças de 2 a 16 anos.
        </p>
      </div>

      <CatalogClient
        initialProducts={products}
        categories={categories}
        currentCategory={searchParams.categoria}
        currentSearch={searchParams.busca}
        currentSize={searchParams.tamanho}
        currentSort={searchParams.sort || "newest"}
      />
    </div>
  );
}
