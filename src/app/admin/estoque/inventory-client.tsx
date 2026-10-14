"use client";

import React, { useState } from "react";
import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Boxes, AlertTriangle, ArrowUpDown, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { updateVariantStock } from "@/lib/data";

interface InventoryClientProps {
  products: Product[];
}

export function InventoryClient({ products: initialProducts }: InventoryClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Dialog state for stock adjustment
  const [adjustingVariant, setAdjustingVariant] = useState<{
    productId: string;
    productName: string;
    variantId: string;
    size: string;
    color: string;
    sku: string;
    currentStock: number;
  } | null>(null);

  const [newStockInput, setNewStockInput] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flatten all variants with product info
  const allVariants = products.flatMap((p) =>
    (p.variants || []).map((v) => ({
      ...v,
      productId: p.id,
      productName: p.name,
      categoryName: p.category?.name || "Sem categoria",
    }))
  );

  const filteredVariants = allVariants.filter((v) => {
    const matchesSearch =
      v.productName.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.color.toLowerCase().includes(search.toLowerCase());
    const matchesLow = onlyLowStock ? v.stock <= 5 : true;
    return matchesSearch && matchesLow;
  });

  const openAdjustmentModal = (v: any) => {
    setAdjustingVariant({
      productId: v.productId,
      productName: v.productName,
      variantId: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      currentStock: v.stock,
    });
    setNewStockInput(v.stock);
    setAdjustmentReason("Contagem física de inventário");
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingVariant) return;

    if (newStockInput < 0) {
      toast.error("O estoque não pode ser negativo.");
      return;
    }

    if (!adjustmentReason.trim()) {
      toast.error("Informe o motivo do ajuste.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateVariantStock(
        adjustingVariant.variantId,
        newStockInput,
        adjustmentReason.trim()
      );

      // Update local state
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === adjustingVariant.productId) {
            return {
              ...p,
              variants: p.variants?.map((v) =>
                v.id === adjustingVariant.variantId
                  ? { ...v, stock: newStockInput }
                  : v
              ),
            };
          }
          return p;
        })
      );

      toast.success(
        `Estoque de ${adjustingVariant.productName} (Tam ${adjustingVariant.size}) ajustado para ${newStockInput} un.`
      );
      setAdjustingVariant(null);
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar estoque.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Controle de Estoque por Variante
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitore a quantidade física de cada tamanho (2 ao 16) e cor com prevenção contra estoque negativo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={onlyLowStock ? "default" : "outline"}
            size="sm"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className="rounded-full text-xs gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Apenas Estoque Baixo (≤ 5)</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 bg-card p-4 rounded-3xl border shadow-sm">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Filtrar por nome da peça, cor ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-full text-xs"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground">
                <th className="p-4 font-semibold">Produto</th>
                <th className="p-4 font-semibold">Tamanho</th>
                <th className="p-4 font-semibold">Cor</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Estoque Físico</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredVariants.map((v) => {
                const isCritical = v.stock <= 5;
                const isZero = v.stock === 0;

                return (
                  <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-brand-dark">
                      {v.productName}
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-brand-purple bg-brand-pinkLight px-2.5 py-1 rounded-lg">
                        Tam {v.size}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">
                      {v.color}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-muted-foreground">
                      {v.sku}
                    </td>
                    <td className="p-4 font-bold text-sm text-brand-dark">
                      {v.stock} un
                    </td>
                    <td className="p-4">
                      {isZero ? (
                        <Badge variant="destructive" className="text-[10px]">
                          Esgotado
                        </Badge>
                      ) : isCritical ? (
                        <Badge variant="warning" className="text-[10px]">
                          Estoque Baixo
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Normal
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAdjustmentModal(v)}
                        className="rounded-full text-xs h-8 px-3 gap-1"
                      >
                        <ArrowUpDown className="w-3 h-3 text-brand-purple" />
                        <span>Ajustar</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajuste Manual de Estoque */}
      {adjustingVariant && (
        <Dialog open={true} onOpenChange={() => setAdjustingVariant(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-brand-purple" />
                <span>Ajustar Estoque de Variante</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 pt-2">
              <div className="p-3 rounded-2xl bg-muted/40 border text-xs space-y-1">
                <p className="font-bold text-brand-dark">
                  {adjustingVariant.productName}
                </p>
                <p className="text-muted-foreground">
                  Tamanho: <strong>{adjustingVariant.size}</strong> • Cor: {adjustingVariant.color}
                </p>
                <p className="text-muted-foreground font-mono">
                  SKU: {adjustingVariant.sku}
                </p>
                <p className="font-semibold text-brand-purple pt-1">
                  Estoque Atual: {adjustingVariant.currentStock} unidades
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-stock" className="text-xs font-semibold">
                  Nova Quantidade Físico *
                </Label>
                <Input
                  id="new-stock"
                  type="number"
                  min="0"
                  required
                  value={newStockInput}
                  onChange={(e) => setNewStockInput(parseInt(e.target.value) || 0)}
                  className="rounded-full font-bold text-base"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reason" className="text-xs font-semibold">
                  Motivo da Movimentação / Ajuste *
                </Label>
                <select
                  id="reason"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full h-11 px-4 rounded-full border bg-background text-xs outline-none focus:ring-2 focus:ring-brand-purple"
                >
                  <option value="Contagem física de inventário">
                    Contagem física de inventário
                  </option>
                  <option value="Entrada de novas peças da confecção">
                    Entrada de novas peças da confecção
                  </option>
                  <option value="Venda presencial realizada">
                    Venda presencial realizada
                  </option>
                  <option value="Devolução ou troca de cliente">
                    Devolução ou troca de cliente
                  </option>
                  <option value="Avaria ou perda identificada">
                    Avaria ou perda identificada
                  </option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAdjustingVariant(null)}
                  className="flex-1 rounded-full text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full text-xs font-bold"
                >
                  {isSubmitting ? "Gravando..." : "Salvar Ajuste"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
