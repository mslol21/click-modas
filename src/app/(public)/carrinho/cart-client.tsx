"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { createOrderIntention } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Phone,
  CheckCircle2,
  MapPin,
  Truck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export function CartClient() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, isInitialized } = useCart();

  // Checkout form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("retirada_galeria_arco_iris");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  if (!isInitialized) {
    return (
      <div className="py-20 text-center text-muted-foreground text-sm animate-pulse">
        Carregando sua sacola de compras...
      </div>
    );
  }

  // Success view after checkout
  if (completedOrderNumber) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-card rounded-3xl border shadow-md text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Intenção de Pedido Criada com Sucesso
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
            Pedido #{completedOrderNumber}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Seu pedido foi registrado em nosso sistema. Uma janela do WhatsApp foi aberta para você enviar a mensagem com a lista de peças para nossa equipe!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-semibold text-brand-dark">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">WhatsApp:</span>
            <span className="font-semibold text-brand-dark">{customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Previsão Entrega:</span>
            <span className="font-semibold text-brand-dark">
              {deliveryMethod === "retirada_galeria_arco_iris"
                ? "Retirada na Galeria Arco-Íris (SP)"
                : "Envio a combinar"}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-bold text-brand-dark">Subtotal das peças:</span>
            <span className="font-bold text-brand-purple text-sm">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/catalogo" className="flex-1">
            <Button variant="outline" className="w-full rounded-full">
              Continuar Comprando
            </Button>
          </Link>
          <a
            href="https://wa.me/5511954686239"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="whatsapp" className="w-full rounded-full gap-2">
              <Phone className="w-4 h-4" />
              <span>Reabrir WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-card rounded-3xl border shadow-sm space-y-5">
        <div className="w-20 h-20 rounded-full bg-brand-pinkLight text-brand-purple flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-brand-dark">Sua Sacola está Vazia</h2>
          <p className="text-sm text-muted-foreground">
            Que tal conferir nossos vestidos e conjuntos encantadores do tamanho 2 ao 16?
          </p>
        </div>
        <Link href="/catalogo" className="inline-block">
          <Button size="lg" className="rounded-full shadow-md">
            Explorar Catálogo Infantil
          </Button>
        </Link>
      </div>
    );
  }

  // Handle WhatsApp Checkout submission
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Por favor, preencha o seu nome.");
      return;
    }

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, "").length < 10) {
      toast.error("Por favor, preencha um número de WhatsApp válido com DDD.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order intention in system (with server re-validation)
      const newOrder = await createOrderIntention({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryMethod,
        customerNotes: customerNotes.trim(),
        items: items.map((i) => ({
          productId: i.product.id,
          variantId: i.variant.id,
          quantity: i.quantity,
        })),
      });

      // 2. Build structured WhatsApp message link
      const deliveryMethodLabel =
        deliveryMethod === "retirada_galeria_arco_iris"
          ? "Retirada na Galeria Arco-Íris (São Paulo - SP)"
          : "Envio a combinar (Correios / Transportadora)";

      const waUrl = buildWhatsAppLink("5511954686239", {
        orderNumber: newOrder.order_number,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryMethod,
        deliveryMethodLabel,
        customerNotes: customerNotes.trim(),
        subtotal,
        items,
      });

      // 3. Clear cart and set completed state
      clearCart();
      setCompletedOrderNumber(newOrder.order_number);
      toast.success("Pedido gerado com sucesso! Abrindo o WhatsApp...");

      // 4. Open WhatsApp in new tab
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }
    } catch (error: any) {
      console.error("Erro na finalização do pedido:", error);
      toast.error(error.message || "Erro ao processar intenção de pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items list */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b">
          <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <span>Itens Selecionados</span>
            <span className="text-xs bg-brand-pinkLight text-brand-purple font-semibold px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? "produto" : "produtos"}
            </span>
          </h2>
          <button
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Esvaziar sacola
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const unitPrice = item.product.promotional_price ?? item.product.price;
            const itemTotal = unitPrice * item.quantity;
            const coverImage =
              item.product.images?.find((img) => img.is_cover)?.image_url ||
              item.product.images?.[0]?.image_url ||
              "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300&auto=format&fit=crop&q=80";

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card border shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={coverImage}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <Link
                    href={`/produto/${item.product.slug}`}
                    className="text-sm font-semibold text-brand-dark hover:text-brand-purple transition-colors truncate block"
                  >
                    {item.product.name}
                  </Link>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="bg-muted px-2 py-0.5 rounded-md font-semibold text-brand-dark">
                      Tam: {item.variant.size}
                    </span>
                    <span className="bg-muted px-2 py-0.5 rounded-md font-medium">
                      {item.variant.color}
                    </span>
                    <span className="font-mono text-[10px] self-center">
                      {item.variant.sku}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-brand-purple pt-1">
                    {formatCurrency(unitPrice)}{" "}
                    <span className="font-normal text-muted-foreground">cada</span>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded-full transition-colors"
                    title="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center rounded-full border bg-muted/20 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-brand-dark text-xs transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.variant.stock}
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-brand-dark text-xs disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-extrabold text-brand-dark">
                    {formatCurrency(itemTotal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear Policy Alert */}
        <div className="p-4 rounded-2xl bg-brand-pinkLight/30 border border-brand-lilac/30 text-xs text-muted-foreground space-y-1">
          <p className="font-bold text-brand-dark flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-purple" />
            Compra 100% Segura e Transparente
          </p>
          <p>
            Não cobramos nada no site. A finalização, conferência das peças e forma de pagamento (Pix / cartão) serão alinhadas diretamente no WhatsApp da Click Modas 25.
          </p>
        </div>
      </div>

      {/* Checkout Sidebar Form */}
      <div className="lg:col-span-5 bg-card rounded-3xl border shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Resumo e Finalização</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Preencha seus dados para gerarmos o pedido oficial no WhatsApp.
          </p>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Seu Nome Completo *
            </Label>
            <Input
              id="name"
              type="text"
              required
              placeholder="Ex: Maria Eduarda Silva"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="rounded-full"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold">
              Seu WhatsApp com DDD *
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              placeholder="Ex: (11) 98765-4321"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="rounded-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Preferência de Entrega *
            </Label>
            <div className="grid grid-cols-1 gap-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod === "retirada_galeria_arco_iris"
                    ? "border-brand-purple bg-brand-pinkLight/30 text-brand-dark"
                    : "border-input bg-card text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="retirada_galeria_arco_iris"
                  checked={deliveryMethod === "retirada_galeria_arco_iris"}
                  onChange={() => setDeliveryMethod("retirada_galeria_arco_iris")}
                  className="mt-1 text-brand-purple focus:ring-brand-purple"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-brand-dark block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                    Retirar na Galeria Arco-Íris (São Paulo)
                  </span>
                  <span>Sem custo de frete. Agendamento prévio após separação.</span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  deliveryMethod === "combinar_envio"
                    ? "border-brand-purple bg-brand-pinkLight/30 text-brand-dark"
                    : "border-input bg-card text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="combinar_envio"
                  checked={deliveryMethod === "combinar_envio"}
                  onChange={() => setDeliveryMethod("combinar_envio")}
                  className="mt-1 text-brand-purple focus:ring-brand-purple"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-brand-dark block flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-brand-purple" />
                    Envio para todo o Brasil (a combinar)
                  </span>
                  <span>Custo e prazo cotados com a loja no WhatsApp.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">
              Observações adicionais (opcional)
            </Label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Ex: Gostaria de saber se tem a tiara combinando..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              className="w-full rounded-2xl border border-input p-3 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          {/* Pricing Summary */}
          <div className="pt-4 border-t space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal dos produtos:</span>
              <span className="font-semibold text-brand-dark">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Frete:</span>
              <span className="text-xs font-semibold text-brand-purple">
                Confirmado pelo WhatsApp
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-brand-dark pt-2 border-t">
              <span>Total provisório:</span>
              <span className="text-brand-purple text-xl">{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="whatsapp"
            size="lg"
            disabled={isSubmitting}
            className="w-full rounded-full gap-2 text-base font-bold shadow-md h-12"
          >
            <Phone className="w-5 h-5" />
            <span>{isSubmitting ? "Enviando Pedido..." : "Finalizar Pedido no WhatsApp"}</span>
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            Ao clicar, seu pedido será registrado e o WhatsApp oficial da Click Modas 25 será aberto.
          </p>
        </form>
      </div>
    </div>
  );
}
