import React from "react";
import { Metadata } from "next";
import { getAllProductsAdmin } from "@/lib/admin-data";
import { InventoryClient } from "./inventory-client";

export const metadata: Metadata = {
  title: "Controle de Estoque | Admin Click Modas 25",
};

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const products = await getAllProductsAdmin();

  return <InventoryClient products={products} />;
}
