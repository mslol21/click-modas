"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  CheckCircle2,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Order } from "@/types/database";

interface DashboardClientProps {
  stats: {
    totalOrders: number;
    initiatedOrders: number;
    confirmedOrders: number;
    completedOrders: number;
    confirmedRevenue: number;
    activeProducts: number;
    lowStockCount: number;
    lowStockVariants: any[];
    recentOrders: Order[];
  };
}

export function DashboardClient({ stats }: DashboardClientProps) {
  // Chart data: Distribution of order stages
  const ordersFunnelData = [
    { name: "Iniciados", quantidade: stats.initiatedOrders, fill: "#A879CF" },
    { name: "Confirmados", quantidade: stats.confirmedOrders, fill: "#7544A0" },
    { name: "Concluídos", quantidade: stats.completedOrders, fill: "#10B981" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Visão Geral do Negócio
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Acompanhe pedidos pelo WhatsApp, movimentações de estoque e faturamento da Click Modas 25.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/produtos/novo">
            <Button className="rounded-full gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Cadastrar Produto</span>
            </Button>
          </Link>
          <Link href="/admin/pedidos">
            <Button variant="outline" className="rounded-full gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-purple" />
              <span>Ver Pedidos</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Confirmed Revenue */}
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Faturamento Confirmado
            </CardTitle>
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-700">
              {formatCurrency(stats.confirmedRevenue)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Apenas vendas pagas e confirmadas
            </p>
          </CardContent>
        </Card>

        {/* Initiated Orders */}
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pedidos Iniciados
            </CardTitle>
            <div className="w-9 h-9 rounded-full bg-purple-100 text-brand-purple flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-brand-purple">
              {stats.initiatedOrders}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Clientes que abriram o WhatsApp
            </p>
          </CardContent>
        </Card>

        {/* Confirmed Orders */}
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pedidos Confirmados
            </CardTitle>
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-brand-dark">
              {stats.confirmedOrders}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Vendas em separação ou pagas
            </p>
          </CardContent>
        </Card>

        {/* Active Products & Low Stock */}
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Estoque & Catálogo
            </CardTitle>
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-brand-dark">
                {stats.activeProducts}
              </span>
              <span className="text-xs text-muted-foreground">peças ativas</span>
            </div>
            <div className="mt-1">
              {stats.lowStockCount > 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  {stats.lowStockCount} variantes com estoque baixo
                </span>
              ) : (
                <span className="text-[11px] text-emerald-600 font-medium">
                  Estoque equilibrado
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Funnel chart */}
        <Card className="lg:col-span-7 rounded-3xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-purple" />
              <span>Funil de Atendimento no WhatsApp</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Diferenciação clara entre intenções de compra e pedidos efetivados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(val) => [`${val} pedidos`, "Quantidade"]}
                    contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0" }}
                  />
                  <Bar dataKey="quantidade" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="lg:col-span-5 rounded-3xl border shadow-sm flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Alertas de Estoque Baixo</span>
              </CardTitle>
              <Link href="/admin/estoque" className="text-xs text-brand-purple hover:underline font-semibold">
                Gerenciar
              </Link>
            </div>
            <CardDescription className="text-xs">
              Variantes que precisam de reposição em breve (≤ 5 unidades)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {stats.lowStockVariants.length > 0 ? (
              stats.lowStockVariants.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 text-xs border"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <p className="font-semibold text-brand-dark truncate">
                      {v.productName}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Tam: <strong>{v.size}</strong> • Cor: {v.color}
                    </p>
                  </div>
                  <Badge variant="warning" className="text-[11px] font-bold shrink-0">
                    {v.stock} un
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-muted-foreground">
                Nenhum produto com estoque crítico no momento!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="rounded-3xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Pedidos Recentes</CardTitle>
            <CardDescription className="text-xs">
              Últimas solicitações recebidas pelo site
            </CardDescription>
          </div>
          <Link href="/admin/pedidos">
            <Button variant="outline" size="sm" className="rounded-full text-xs gap-1">
              <span>Ver todos os pedidos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-3 font-semibold">Código</th>
                  <th className="pb-3 font-semibold">Cliente</th>
                  <th className="pb-3 font-semibold">Entrega</th>
                  <th className="pb-3 font-semibold">Subtotal</th>
                  <th className="pb-3 font-semibold">Situação</th>
                  <th className="pb-3 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {stats.recentOrders.map((order) => {
                  let statusBadge = <Badge variant="secondary">Iniciado</Badge>;
                  if (order.status === "confirmado") {
                    statusBadge = <Badge variant="default">Confirmado</Badge>;
                  } else if (order.status === "pago") {
                    statusBadge = <Badge variant="success">Pago</Badge>;
                  }

                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono font-bold text-brand-purple">
                        {order.order_number}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-brand-dark">
                          {order.customer_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {order.delivery_method === "retirada_galeria_arco_iris"
                          ? "Retirada Galeria"
                          : "Envio a combinar"}
                      </td>
                      <td className="py-3 font-bold text-brand-dark">
                        {formatCurrency(order.subtotal)}
                      </td>
                      <td className="py-3">{statusBadge}</td>
                      <td className="py-3 text-right">
                        <Link href={`/admin/pedidos?id=${order.id}`}>
                          <Button size="sm" variant="ghost" className="rounded-full h-8 px-3 text-xs">
                            Detalhes
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
