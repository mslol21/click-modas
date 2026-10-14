import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const coverImage =
    product.images?.find((img) => img.is_cover)?.image_url ||
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80";

  const hasDiscount =
    product.promotional_price !== null &&
    product.promotional_price !== undefined &&
    product.promotional_price < product.price;

  const currentPrice = hasDiscount ? product.promotional_price! : product.price;

  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;

  const availableSizes = Array.from(
    new Set(product.variants?.filter((v) => v.stock > 0).map((v) => v.size) || [])
  );

  return (
    <div className="group relative flex flex-col rounded-3xl border bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-brand-lilac/50">
      {/* Product Image */}
      <Link
        href={`/produto/${product.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted/50 mb-3"
      >
        <Image
          src={coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <Badge variant="promo" className="text-[11px] uppercase tracking-wider">
              Oferta
            </Badge>
          )}
          {product.is_featured && !hasDiscount && (
            <Badge variant="default" className="text-[11px] uppercase tracking-wider">
              Destaque
            </Badge>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {totalStock === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Esgotado
            </span>
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="flex flex-col flex-1">
        {product.category && (
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
            {product.category.name}
          </span>
        )}

        <Link
          href={`/produto/${product.slug}`}
          className="text-sm sm:text-base font-semibold text-brand-dark group-hover:text-brand-purple transition-colors line-clamp-2 leading-snug mb-2"
        >
          {product.name}
        </Link>

        {/* Available Sizes preview */}
        {availableSizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-[10px] text-muted-foreground font-medium self-center mr-0.5">
              Tam:
            </span>
            {availableSizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-muted text-brand-dark"
              >
                {size}
              </span>
            ))}
            {availableSizes.length > 5 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{availableSizes.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div className="mt-auto pt-2 border-t flex items-end justify-between gap-2">
          <div>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through block">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-brand-purple">
              {formatCurrency(currentPrice)}
            </span>
          </div>

          <Link
            href={`/produto/${product.slug}`}
            className="text-xs font-bold text-brand-purple bg-brand-pinkLight hover:bg-brand-purple hover:text-white px-3 py-1.5 rounded-full transition-all duration-200"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}
