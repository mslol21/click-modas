import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProductsAdmin, getCategories } from "@/lib/data";
import { EditProductClient } from "./edit-product-client";

export const metadata: Metadata = {
  title: "Editar Produto | Admin Click Modas 25",
};

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const products = await getAllProductsAdmin();
  const product = products.find((p) => p.id === params.id);
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  return <EditProductClient product={product} categories={categories} />;
}
