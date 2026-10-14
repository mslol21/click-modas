import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProducts, getSizeGuide } from "@/lib/data";
import { ProductDetailsClient } from "./product-details-client";
import { ProductCard } from "@/components/product/product-card";
import { ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Produto Não Encontrado",
    };
  }

  const coverImage =
    product.images?.find((i) => i.is_cover)?.image_url ||
    product.images?.[0]?.image_url;

  return {
    title: `${product.name} | Click Modas 25 - Moda Infantil`,
    description:
      product.description ||
      `Compre ${product.name} na Click Modas 25. Moda infantil delicada do tamanho 2 ao 16 com pedidos pelo WhatsApp.`,
    openGraph: {
      title: product.name,
      description: product.description || "Moda infantil do tamanho 2 ao 16.",
      images: coverImage ? [{ url: coverImage }] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  const sizeGuide = await getSizeGuide();

  if (!product) {
    notFound();
  }

  // Fetch related products from same category
  const relatedProducts = (
    await getProducts({
      categorySlug: product.category?.slug,
    })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // JSON-LD structured data for Google SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img) => img.image_url) || [],
    description: product.description,
    sku: product.sku_base || product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.promotional_price ?? product.price,
      availability:
        (product.variants?.some((v) => v.stock > 0))
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Click Modas 25",
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand-purple transition-colors">
          Início
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/catalogo" className="hover:text-brand-purple transition-colors">
          Catálogo
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/catalogo?categoria=${product.category.slug}`}
              className="hover:text-brand-purple transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-dark font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Section */}
      <ProductDetailsClient product={product} sizeGuide={sizeGuide} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t pt-10 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Combine seus looks
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
              Você Também Pode Gostar
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
