import React from "react";
import { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { NewProductClient } from "./new-product-client";

export const metadata: Metadata = {
  title: "Novo Produto | Admin Click Modas 25",
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return <NewProductClient categories={categories} />;
}
