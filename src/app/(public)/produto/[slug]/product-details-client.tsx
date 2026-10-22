"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/types/database";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { buildDirectProductWhatsAppLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingBag,
  Phone,
  Ruler,
  CheckCircle,
  AlertCircle,
  Truck,
  HeartHandshake,
  Minus,
  Plus,
} from "lucide-react";

interface ProductDetailsClientProps {
  product: Product;
  sizeGuide: Array<{
    size: string;
    age: string;
    chest: string;
    waist: string;
    height: string;
  }>;
}

export function ProductDetailsClient({
  product,
  sizeGuide,
}: ProductDetailsClientProps) {
  const { addItem } = useCart();

  const images = product.images && product.images.length > 0
    ? product.images
    : [
        {
          id: "default-img",
          product_id: product.id,
          image_url:
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
          alt_text: product.name,
          sort_order: 1,
          is_cover: true,
          created_at: "",
        },
      ];

  const [activeImage, setActiveImage] = useState(images[0].image_url);

  // Available unique sizes and colors
  const variants = product.variants || [];
  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  // Selection states
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");
  const [quantity, setQuantity] = useState(1);

  // Find variant matching current selection
  const selectedVariant: ProductVariant | undefined = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || variants.find((v) => v.size === selectedSize) || variants[0];

  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;
  const maxAvailable = selectedVariant ? selectedVariant.stock : 0;

  const hasDiscount =
    product.promotional_price !== null &&
    product.promotional_price !== undefined &&
    product.promotional_price < product.price;

  const currentPrice = hasDiscount ? product.promotional_price! : product.price;

  const handleQuantityDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQuantityIncrease = () => {
    if (quantity < maxAvailable) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
  };

  const whatsAppDirectLink = buildDirectProductWhatsAppLink(
    "5511954686239",
    product.name,
    selectedVariant?.size,
    selectedVariant?.color,
    currentPrice
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* 1. Image Gallery */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main image */}
        <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] w-full rounded-3xl overflow-hidden bg-muted border shadow-sm">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-center"
          />

          {hasDiscount && (
            <Badge
              variant="promo"
              className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1 shadow-md"
            >
              Oferta Especial
            </Badge>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-brand-dark text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                Variante Esgotada no Momento
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.image_url)}
                className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImage === img.image_url
                    ? "border-brand-purple shadow-sm scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Product Details & Purchase Actions */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        <div>
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-1 leading-snug">
            {product.name}
          </h1>
          {selectedVariant && (
            <p className="text-xs text-muted-foreground mt-1">
              SKU: <span className="font-mono">{selectedVariant.sku}</span>
            </p>
          )}
        </div>

        {/* Price display */}
        <div className="p-4 rounded-2xl bg-brand-pinkLight/40 border border-brand-lilac/20 flex items-center justify-between">
          <div>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through block">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-3xl font-extrabold text-brand-purple">
              {formatCurrency(currentPrice)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full block">
              Pronta Entrega
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              Pagamento via WhatsApp / Pix
            </span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Selecione o Tamanho:
            </label>

            {/* Modal Guia de Medidas */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-xs text-brand-purple font-semibold hover:underline flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guia de Medidas</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-brand-purple" />
                    <span>Tabela e Guia de Medidas (2 a 16 anos)</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="text-xs text-muted-foreground mb-2">
                  Medidas de referência padrão para roupas infantis da Click Modas 25.
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Idade Média</TableHead>
                      <TableHead>Tórax</TableHead>
                      <TableHead>Cintura</TableHead>
                      <TableHead>Altura</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sizeGuide.map((item) => (
                      <TableRow key={item.size}>
                        <TableCell className="font-bold text-brand-purple">
                          Tam {item.size}
                        </TableCell>
                        <TableCell>{item.age}</TableCell>
                        <TableCell>{item.chest}</TableCell>
                        <TableCell>{item.waist}</TableCell>
                        <TableCell>{item.height}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variantForSize = variants.find((v) => v.size === size);
              const available = variantForSize && variantForSize.stock > 0;

              return (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setQuantity(1);
                  }}
                  disabled={!available}
                  className={`h-11 min-w-[3rem] px-3 rounded-2xl font-bold text-sm border transition-all ${
                    selectedSize === size
                      ? "border-brand-purple bg-brand-purple text-white shadow-sm"
                      : available
                      ? "border-input bg-card hover:bg-muted text-brand-dark"
                      : "border-dashed border-muted text-muted-foreground/40 cursor-not-allowed bg-muted/20"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Selection */}
        {colors.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Cor / Estampa: <span className="text-brand-purple">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setQuantity(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "border-brand-purple bg-brand-pinkLight text-brand-purple font-bold shadow-sm"
                        : "border-input bg-card hover:bg-muted text-brand-dark"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock Status Indicator */}
        <div className="flex items-center gap-2 text-xs">
          {!isOutOfStock ? (
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Disponível em estoque ({maxAvailable} unidades prontas para envio)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-destructive font-medium">
              <AlertCircle className="w-4 h-4" />
              Tamanho e cor esgotados no momento
            </span>
          )}
        </div>

        {/* Quantity selector */}
        {!isOutOfStock && (
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Quantidade:
            </span>
            <div className="flex items-center rounded-full border bg-muted/30 p-1">
              <button
                onClick={handleQuantityDecrease}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-40 transition-colors"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm">
                {quantity}
              </span>
              <button
                onClick={handleQuantityIncrease}
                disabled={quantity >= maxAvailable}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white disabled:opacity-40 transition-colors"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CTAs: Add to Cart and Buy with WhatsApp */}
        <div className="space-y-3 pt-2">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full rounded-full gap-2 text-base font-bold shadow-md"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Adicionar à Sacola de Compras</span>
          </Button>

          <a
            href={whatsAppDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="whatsapp"
              size="lg"
              className="w-full rounded-full gap-2 text-base font-bold"
            >
              <Phone className="w-5 h-5" />
              <span>Tirar Dúvida no WhatsApp</span>
            </Button>
          </a>
        </div>

        {/* Store Trust Elements */}
        <div className="border-t pt-4 space-y-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-purple" />
            <span>
              <strong>Retirada ou Envio:</strong> Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP ou Correios/transportadora.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-brand-purple" />
            <span>
              <strong>Atendimento individual:</strong> Confirmamos as medidas e frete antes de fechar.
            </span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="border-t pt-4 space-y-2">
            <h3 className="font-bold text-sm text-brand-dark">
              Descrição do Produto
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
