"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  Search,
  Phone,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/data";

interface OrdersListClientProps {
  initialOrders: Order[];
  selectedOrderId?: string;
}

const ORDER_STATUS_LABELS: Record<OrderStatus, { label: string; badgeVariant: "default" | "secondary" | "success" | "warning" | "destructive" }> = {
  pedido_iniciado: { label: "Pedido Iniciado", badgeVariant: "secondary" },
  aguardando_confirmacao: { label: "Aguardando Confirmação", badgeVariant: "warning" },
  confirmado: { label: "Confirmado", badgeVariant: "default" },
  aguardando_pagamento: { label: "Aguardando Pgto", badgeVariant: "warning" },
  pago: { label: "Pago", badgeVariant: "success" },
  em_separacao: { label: "Em Separação", badgeVariant: "default" },
  enviado: { label: "Enviado", badgeVariant: "default" },
  entregue: { label: "Entregue", badgeVariant: "success" },
  cancelado: { label: "Cancelado", badgeVariant: "destructive" },
};

export function OrdersListClient({
  initialOrders,
  selectedOrderId,
}: OrdersListClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected Order for Modal View & Editing
  const initialSelected = initialOrders.find((o) => o.id === selectedOrderId) || null;
  const [activeOrder, setActiveOrder] = useState<Order | null>(initialSelected);

  // Modal editing form state
  const [editStatus, setEditStatus] = useState<OrderStatus>("pedido_iniciado");
  const [editFee, setEditFee] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const openOrderModal = (order: Order) => {
    setActiveOrder(order);
    setEditStatus(order.status);
    setEditFee(order.delivery_fee || 0);
    setEditNotes(order.internal_notes || "");
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);
    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    setIsUpdating(true);

    try {
      const updated = await updateOrderStatus(
        activeOrder.id,
        editStatus,
        editNotes.trim(),
        editFee
      );

      setOrders((prev) =>
        prev.map((o) => (o.id === activeOrder.id ? { ...o, ...updated } : o))
      );
      setActiveOrder({ ...activeOrder, ...updated });
      toast.success(`Pedido #${activeOrder.order_number} atualizado!`);
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar pedido.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportCSV = () => {
    const headers = "Código,Data,Cliente,WhatsApp,Entrega,Frete,Subtotal,Total,Situação\n";
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.order_number}","${new Date(o.created_at).toLocaleDateString()}","${o.customer_name}","${o.customer_phone}","${o.delivery_method}","${o.delivery_fee}","${o.subtotal}","${o.total}","${o.status}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pedidos-clickmodas25-${Date.now()}.csv`;
    link.click();
    toast.success("Relatório CSV exportado com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Gestão de Pedidos
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Acompanhe pedidos iniciados no WhatsApp, confirme pagamentos e registre valores de frete.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="rounded-full text-xs gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-brand-purple" />
          <span>Exportar Relatório CSV</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card p-4 rounded-3xl border shadow-sm">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar por código (CMD-...), nome do cliente ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-full text-xs"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
        </div>

        <div className="sm:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-4 rounded-full border bg-background text-xs text-brand-dark outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="all">Todas as situações</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground">
                <th className="p-4 font-semibold">Código</th>
                <th className="p-4 font-semibold">Data / Hora</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Modalidade</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Situação</th>
                <th className="p-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.map((order) => {
                const statusMeta =
                  ORDER_STATUS_LABELS[order.status] || {
                    label: order.status,
                    badgeVariant: "secondary",
                  };

                return (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-purple">
                      {order.order_number}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}{" "}
                      <span className="text-[10px]">
                        {new Date(order.created_at).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-brand-dark">
                        {order.customer_name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {order.customer_phone}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {order.delivery_method === "retirada_galeria_arco_iris"
                        ? "Retirada Galeria"
                        : "Envio a combinar"}
                    </td>
                    <td className="p-4 font-bold text-brand-dark">
                      {formatCurrency(order.total || order.subtotal)}
                    </td>
                    <td className="p-4">
                      <Badge variant={statusMeta.badgeVariant}>
                        {statusMeta.label}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/55${order.customer_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          title="Abrir WhatsApp com cliente"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openOrderModal(order)}
                          className="rounded-full text-xs h-8 px-3"
                        >
                          Gerenciar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalhes e Alteração de Status */}
      {activeOrder && (
        <Dialog open={true} onOpenChange={() => setActiveOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-purple" />
                  <span>Pedido #{activeOrder.order_number}</span>
                </DialogTitle>
                <Badge
                  variant={
                    ORDER_STATUS_LABELS[activeOrder.status]?.badgeVariant || "secondary"
                  }
                >
                  {ORDER_STATUS_LABELS[activeOrder.status]?.label || activeOrder.status}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-2 text-xs">
              {/* Customer info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border">
                <div>
                  <span className="text-muted-foreground block">Cliente:</span>
                  <span className="font-bold text-sm text-brand-dark block">
                    {activeOrder.customer_name}
                  </span>
                  <span className="text-muted-foreground block mt-0.5">
                    Telefone: {activeOrder.customer_phone}
                  </span>
                </div>
                <div className="flex sm:justify-end items-center">
                  <a
                    href={`https://wa.me/55${activeOrder.customer_phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full font-bold shadow-sm hover:bg-[#20BD5A]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Conversar no WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Order items snapshot */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Peças Solicitadas ({activeOrder.items?.length || 0} itens)
                </h4>
                <div className="divide-y divide-border/60 border rounded-2xl overflow-hidden bg-card">
                  {(activeOrder.items || []).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-bold text-brand-dark">
                          {item.product_name}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          Tamanho: <strong>{item.variant_size}</strong> • Cor: {item.variant_color} • SKU: {item.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-brand-dark">
                          {item.quantity} x {formatCurrency(item.unit_price)}
                        </p>
                        <p className="font-extrabold text-brand-purple">
                          {formatCurrency(item.total_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order management form: status, fee, notes */}
              <form onSubmit={handleStatusSave} className="space-y-4 pt-2 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-brand-dark">
                      Situação do Pedido:
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="w-full h-11 px-4 rounded-full border bg-background font-bold text-brand-dark outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      {Object.entries(ORDER_STATUS_LABELS).map(([key, item]) => (
                        <option key={key} value={key}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-brand-dark">
                      Taxa / Valor de Entrega (R$):
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editFee}
                      onChange={(e) => setEditFee(parseFloat(e.target.value) || 0)}
                      className="rounded-full h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-brand-dark">
                    Anotações Internas da Loja (visíveis apenas para você):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Cliente pagou via Pix às 15:30. Pacote pronto para motoboy."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full rounded-2xl border border-input p-3 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border space-y-1 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal das peças:</span>
                    <span className="font-bold text-brand-dark">
                      {formatCurrency(activeOrder.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Valor da Entrega:</span>
                    <span className="font-bold text-brand-dark">
                      {formatCurrency(editFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-brand-dark pt-2 border-t">
                    <span>Total Final:</span>
                    <span className="text-brand-purple">
                      {formatCurrency(activeOrder.subtotal + editFee)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveOrder(null)}
                    className="flex-1 rounded-full text-xs"
                  >
                    Fechar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 rounded-full text-xs font-bold"
                  >
                    {isUpdating ? "Atualizando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
