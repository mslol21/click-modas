import React from "react";
import { Metadata } from "next";
import { getAllOrdersAdmin } from "@/lib/data";
import { OrdersListClient } from "./orders-list-client";

export const metadata: Metadata = {
  title: "Gestão de Pedidos | Admin Click Modas 25",
};

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: {
    id?: string;
  };
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const orders = await getAllOrdersAdmin();

  return (
    <OrdersListClient initialOrders={orders} selectedOrderId={searchParams.id} />
  );
}
