"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Product, Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface EditProductClientProps {
  product: Product;
  categories: Category[];
}

export function EditProductClient({ product, categories }: EditProductClientProps) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.category_id || categories[0]?.id || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price.toString());
  const [promotionalPrice, setPromotionalPrice] = useState(
    product.promotional_price ? product.promotional_price.toString() : ""
  );
  const [skuBase, setSkuBase] = useState(product.sku_base || "");
  const [isPublished, setIsPublished] = useState(product.is_published);
  const [isFeatured, setIsFeatured] = useState(product.is_featured);

  // Photos
  const [imageUrl, setImageUrl] = useState("");
  const [imageList, setImageList] = useState<string[]>(
    product.images?.map((i) => i.image_url) || [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
    ]
  );

  // Variants
  const [variants, setVariants] = useState(
    product.variants?.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.stock,
    })) || [{ id: "var-1", size: "4", color: "Padrão", sku: "CMD-001", stock: 10 }]
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImageList([...imageList, imageUrl.trim()]);
      setImageUrl("");
      toast.success("Foto adicionada!");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageList(imageList.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `var-new-${Date.now()}`,
        size: "10",
        color: variants[0]?.color || "Padrão",
        sku: `${skuBase || "CMD"}-10`,
        stock: 5,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      toast.error("O produto deve conter ao menos um tamanho.");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success(`Peça "${name}" atualizada com sucesso!`);
      router.push("/admin/produtos");
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/produtos"
            className="p-2 rounded-xl bg-card border text-muted-foreground hover:text-brand-purple"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark">
              Editar Peça: {product.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Altere dados cadastrais, tamanhos e estoque.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/produtos">
            <Button variant="outline" type="button" className="rounded-full text-xs">
              Voltar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSaving}
            className="rounded-full gap-2 text-xs shadow-md font-bold px-6"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? "Salvando..." : "Salvar Alterações"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nome do Produto *</Label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Categoria Infantil</Label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-11 px-4 rounded-full border bg-background text-xs outline-none focus:ring-2 focus:ring-brand-purple"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">SKU Base</Label>
                  <Input
                    type="text"
                    value={skuBase}
                    onChange={(e) => setSkuBase(e.target.value)}
                    className="rounded-full font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Descrição</Label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-input p-3 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Valores e Preços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Preço Normal (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Preço Promocional (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={promotionalPrice}
                    onChange={(e) => setPromotionalPrice(e.target.value)}
                    className="rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants and Stock */}
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Tamanhos e Estoque
                </CardTitle>
                <CardDescription className="text-xs">
                  Modifique a disponibilidade por tamanho
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariant}
                className="rounded-full text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Tamanho</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {variants.map((v, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center p-3 rounded-2xl bg-muted/30 border text-xs"
                >
                  <div className="col-span-3">
                    <Label className="text-[10px] text-muted-foreground">Tamanho</Label>
                    <select
                      value={v.size}
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      className="w-full h-9 rounded-xl border bg-background px-2 text-xs font-bold"
                    >
                      {["2", "4", "6", "8", "10", "12", "14", "16", "M", "G"].map((s) => (
                        <option key={s} value={s}>
                          Tam {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <Label className="text-[10px] text-muted-foreground">Cor</Label>
                    <Input
                      type="text"
                      value={v.color}
                      onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                      className="h-9 rounded-xl text-xs"
                    />
                  </div>

                  <div className="col-span-3">
                    <Label className="text-[10px] text-muted-foreground">SKU</Label>
                    <Input
                      type="text"
                      value={v.sku}
                      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                      className="h-9 rounded-xl text-xs font-mono uppercase"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label className="text-[10px] text-muted-foreground">Estoque</Label>
                    <Input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) =>
                        handleVariantChange(index, "stock", parseInt(e.target.value) || 0)
                      }
                      className="h-9 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="col-span-1 pt-3.5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="p-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-brand-purple focus:ring-brand-purple w-4 h-4"
                />
                <div>
                  <span className="font-bold text-brand-dark block">Ativo na Loja</span>
                  <span className="text-muted-foreground">Exibir para os clientes</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer pt-2 border-t">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-brand-purple focus:ring-brand-purple w-4 h-4"
                />
                <div>
                  <span className="font-bold text-brand-dark block">Destaque na Página Inicial</span>
                </div>
              </label>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Fotos do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="URL da foto"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-full text-xs h-9"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddImage}
                  className="rounded-full h-9 px-3 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {imageList.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border bg-muted group"
                  >
                    <Image
                      src={url}
                      alt="Foto do produto"
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-brand-purple text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Foto de Capa
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
