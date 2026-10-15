"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { saveProduct, uploadProductPhoto } from "@/lib/product-admin";

interface NewProductClientProps {
  categories: Category[];
}

interface VariantInput {
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export function NewProductClient({ categories }: NewProductClientProps) {
  const router = useRouter();

  // Basic info
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [promotionalPrice, setPromotionalPrice] = useState("");
  const [skuBase, setSkuBase] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Photos
  const [imageUrl, setImageUrl] = useState("");
  const [imageList, setImageList] = useState<string[]>([]);

  // Variants
  const [variants, setVariants] = useState<VariantInput[]>([
    { size: "4", color: "Rosa", sku: "CMD-NOVO-4-ROS", stock: 10 },
    { size: "6", color: "Rosa", sku: "CMD-NOVO-6-ROS", stock: 10 },
    { size: "8", color: "Rosa", sku: "CMD-NOVO-8-ROS", stock: 8 },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files=Array.from(event.target.files??[]);
    if(!files.length)return;
    setIsUploading(true);
    try { const urls=await Promise.all(files.map(uploadProductPhoto)); setImageList(prev=>[...prev,...urls]); toast.success(`${urls.length} foto(s) enviada(s) ao Supabase.`); }
    catch(error){toast.error(error instanceof Error?error.message:"Falha no upload.");}
    finally{setIsUploading(false);event.target.value="";}
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImageList([...imageList, imageUrl.trim()]);
      setImageUrl("");
      toast.success("Foto adicionada à galeria!");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageList(imageList.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    const nextSize = "10";
    const nextColor = variants[0]?.color || "Padrão";
    const newSku = `${skuBase || "CMD-NOVO"}-${nextSize}-${nextColor.substring(0, 3).toUpperCase()}`;

    setVariants([
      ...variants,
      { size: nextSize, color: nextColor, sku: newSku, stock: 5 },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      toast.error("O produto deve conter ao menos uma variante de tamanho.");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantInput,
    value: any
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(isUploading){toast.error("Aguarde o envio das fotos.");return;}
    setIsSaving(true);
    try {
      await saveProduct({name,category_id:categoryId||null,description:description||null,price:Number(price),promotional_price:promotionalPrice?Number(promotionalPrice):null,sku_base:skuBase||null,is_published:isPublished,is_featured:isFeatured}, variants, imageList);
      toast.success("Produto salvo no Supabase.");
      router.push("/admin/produtos");
      router.refresh();
    } catch(error){toast.error(error instanceof Error?error.message:"Não foi possível salvar.");}
    finally{setIsSaving(false);}
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
              Cadastrar Nova Peça
            </h1>
            <p className="text-xs text-muted-foreground">
              Preencha os dados e configure tamanhos e estoque.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/produtos">
            <Button variant="outline" type="button" className="rounded-full text-xs">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSaving || isUploading}
            className="rounded-full gap-2 text-xs shadow-md font-bold px-6"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? "Salvando..." : "Salvar Produto"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Informações Básicas</CardTitle>
              <CardDescription className="text-xs">
                Nome de exibição, categoria e descrição da roupinha
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="prod-name" className="text-xs font-semibold">
                  Nome do Produto *
                </Label>
                <Input
                  id="prod-name"
                  type="text"
                  required
                  placeholder="Ex: Vestido Infantil Floral Primavera"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!skuBase) {
                      setSkuBase("CMD-" + e.target.value.substring(0, 3).toUpperCase());
                    }
                  }}
                  className="rounded-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-semibold">
                    Categoria Infantil *
                  </Label>
                  <select
                    id="category"
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
                  <Label htmlFor="sku-base" className="text-xs font-semibold">
                    Código SKU Base
                  </Label>
                  <Input
                    id="sku-base"
                    type="text"
                    placeholder="Ex: CMD-VES-001"
                    value={skuBase}
                    onChange={(e) => setSkuBase(e.target.value)}
                    className="rounded-full font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold">
                  Descrição Completa e Detalhes do Tecido
                </Label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Descreva o tecido (ex: 100% algodão), caimento, fechos e detalhes especiais..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-input p-3 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Valores e Preços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs font-semibold">
                    Preço Normal (R$) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="79.90"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="promo-price" className="text-xs font-semibold">
                    Preço Promocional (Opcional)
                  </Label>
                  <Input
                    id="promo-price"
                    type="number"
                    step="0.01"
                    placeholder="69.90"
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
                  Variantes e Estoque (Tamanhos 2 ao 16)
                </CardTitle>
                <CardDescription className="text-xs">
                  Defina os tamanhos infantis disponíveis, cor e unidades em estoque
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
                    <Label className="text-[10px] text-muted-foreground">Cor / Estampa</Label>
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
                      title="Remover variante"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls: Photos and Publication */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication and Highlight Flags */}
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
                  <span className="text-muted-foreground">Disponível para clientes verem</span>
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
                  <span className="text-muted-foreground">Exibido na vitrine principal</span>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Fotos do Produto</CardTitle>
              <CardDescription className="text-xs">
                Adicione fotos reais de alta qualidade das peças
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block cursor-pointer rounded-xl border-2 border-dashed border-brand-purple/40 p-4 text-center text-xs font-semibold hover:bg-muted/40">
                {isUploading ? "Enviando imagens..." : "Selecionar fotos do computador ou celular (JPG, PNG, WebP, até 5 MB)"}
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} disabled={isUploading||isSaving} className="sr-only" />
              </label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="URL da imagem (ou envie no Supabase)"
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

              {/* Thumbnails preview */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {imageList.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border bg-muted group"
                  >
                    <Image
                      src={url}
                      alt="Prévia da foto"
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
