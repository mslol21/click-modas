"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Product, Category } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Search,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface ProductsListClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsListClient({
  initialProducts,
  categories,
}: ProductsListClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku_base && p.sku_base.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const ensureAdmin = async () => {
    const supabase = createClient();
    if (!supabase) throw new Error("Supabase não configurado.");
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Faça login novamente para gerenciar produtos.");
    const { data: role, error: roleError } = await supabase.from("admin_roles").select("user_id").eq("user_id", user.id).maybeSingle();
    if (roleError || !role) throw new Error("Seu usuário não possui permissão de administrador.");
    return supabase;
  };

  const handleDuplicate = async (product: Product) => {
    if (busyId) return;
    setBusyId(product.id);
    try {
      const supabase = await ensureAdmin();
      const slug = product.slug + "-copia-" + crypto.randomUUID().slice(0, 8);
      const { data, error } = await supabase.from("products").insert({
        name: product.name + " (Cópia)", slug, category_id: product.category_id,
        description: product.description, price: product.price, promotional_price: product.promotional_price,
        sku_base: null, is_published: false, is_featured: false,
      }).select("*").single();
      if (error) throw error;
      const variants = (product.variants ?? []).map(v => ({
        product_id: data.id, size: v.size, color: v.color, color_hex: v.color_hex,
        sku: v.sku + "-CPY-" + data.id.slice(0, 8), stock: 0,
      }));
      if (variants.length) {
        const { error: variantsError } = await supabase.from("product_variants").insert(variants);
        if (variantsError) {
          await supabase.from("products").delete().eq("id", data.id);
          throw variantsError;
        }
      }
      toast.success("Cópia criada como rascunho, sem estoque.");
      router.refresh();
      window.location.reload();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Erro ao duplicar produto."); }
    finally { setBusyId(null); }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (busyId || !window.confirm(`Excluir definitivamente "${productName}" do Supabase? Essa ação não pode ser desfeita.`)) return;
    setBusyId(productId);
    try {
      const supabase = await ensureAdmin();
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
      const { data: stillExists, error: checkError } = await supabase.from("products").select("id").eq("id", productId).maybeSingle();
      if (checkError) throw checkError;
      if (stillExists) throw new Error("Exclusão não autorizada no banco. Verifique as políticas RLS.");
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success(`Produto "${productName}" excluído do Supabase.`);
      router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Erro ao excluir produto."); }
    finally { setBusyId(null); }
  };

  const handleTogglePublished = async (productId: string) => {
    if (busyId) return;
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setBusyId(productId);
    try {
      const supabase = await ensureAdmin();
      const { data, error } = await supabase.from("products").update({ is_published: !product.is_published }).eq("id", productId).select("id,is_published").single();
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === productId ? {...p, is_published: data.is_published} : p));
      toast.success(data.is_published ? "Produto publicado." : "Produto despublicado.");
      router.refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Erro ao alterar publicação."); }
    finally { setBusyId(null); }
  };

  return (
    <div className="space-y-6">
      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Catálogo de Produtos
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Gerencie peças, variantes de tamanhos (2 ao 16), preços e fotos da loja.
          </p>
        </div>

        <Link href="/admin/produtos/novo">
          <Button className="rounded-full gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card p-4 rounded-3xl border shadow-sm">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-full text-xs"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
        </div>

        <div className="sm:w-60">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-10 px-4 rounded-full border bg-background text-xs text-brand-dark outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground">
                <th className="p-4 font-semibold">Peça</th>
                <th className="p-4 font-semibold">Categoria</th>
                <th className="p-4 font-semibold">Preço</th>
                <th className="p-4 font-semibold">Tamanhos / Estoque</th>
                <th className="p-4 font-semibold">Situação</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((product) => {
                const cover =
                  product.images?.find((img) => img.is_cover)?.image_url ||
                  product.images?.[0]?.image_url ||
                  "/click-modas-logo.svg";

                const totalStock =
                  product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;

                const sizesList = Array.from(
                  new Set(product.variants?.map((v) => v.size) || [])
                );

                return (
                  <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                    {/* Image & Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={cover}
                            alt={product.name}
                            fill
                            sizes="50px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/produtos/${product.id}`}
                            className="font-bold text-sm text-brand-dark hover:text-brand-purple line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <span className="font-mono text-[11px] text-muted-foreground block">
                            {product.sku_base || "Sem SKU base"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-muted-foreground font-medium">
                      {product.category?.name || "Sem categoria"}
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      {product.promotional_price ? (
                        <div>
                          <span className="text-[10px] text-muted-foreground line-through block">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="font-bold text-brand-purple">
                            {formatCurrency(product.promotional_price)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-brand-dark">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </td>

                    {/* Variants & Stock */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {sizesList.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-semibold bg-muted px-1.5 py-0.5 rounded text-brand-dark"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground block">
                          Total: {totalStock} un
                        </span>
                      </div>
                    </td>

                    {/* Published & Featured */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => handleTogglePublished(product.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold hover:opacity-80"
                        >
                          {product.is_published ? (
                            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Publicado
                            </span>
                          ) : (
                            <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Rascunho
                            </span>
                          )}
                        </button>
                        {product.is_featured && (
                          <Badge variant="promo" className="text-[10px] py-0 px-1.5">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/produto/${product.slug}`}
                          target="_blank"
                          title="Ver na loja pública"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-brand-purple"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDuplicate(product)}
                          title="Duplicar produto"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-brand-purple"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/admin/produtos/${product.id}`}
                          title="Editar produto"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-brand-purple"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Excluir produto"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
