import React from "react";
import { Metadata } from "next";
import { getAllProductsAdmin, getCategories } from "@/lib/data";
import { ProductsListClient } from "./products-list-client";

export const metadata: Metadata = {
  title: "Gerenciamento de Produtos | Admin Click Modas 25",
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();
  const categories = await getCategories();

  return (
    <ProductsListClient initialProducts={products} categories={categories} />
  );
}
