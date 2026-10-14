import React from "react";
import { Metadata } from "next";
import { CartClient } from "./cart-client";

export const metadata: Metadata = {
  title: "Sacola de Compras | Click Modas 25",
  description:
    "Confira os itens selecionados na sua sacola de compras e envie seu pedido diretamente para o WhatsApp da Click Modas 25.",
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Click Modas 25 / Carrinho
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
          Sua Sacola de Compras
        </h1>
        <p className="text-sm text-muted-foreground">
          Revise as peças, tamanhos e cores escolhidos antes de prosseguir para o atendimento no WhatsApp.
        </p>
      </div>

      <CartClient />
    </div>
  );
}
