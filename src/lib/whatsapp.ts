import { WhatsAppOrderDetails } from "@/types/cart";
import { formatCurrency } from "./utils";

export const DEFAULT_WHATSAPP_NUMBER = "5511954686239";

export function generateWhatsAppMessage(details: WhatsAppOrderDetails): string {
  const lines: string[] = [];

  lines.push(`🛍️ *NOVO PEDIDO - CLICK MODAS 25*`);
  lines.push(`Código: *${details.orderNumber}*`);
  lines.push(`────────────────────────────`);
  lines.push(`👤 *Cliente:* ${details.customerName}`);
  lines.push(`📞 *WhatsApp:* ${details.customerPhone}`);
  lines.push(`🚚 *Modalidade de Entrega:* ${details.deliveryMethodLabel}`);

  if (details.customerNotes && details.customerNotes.trim() !== "") {
    lines.push(`📝 *Observações:* ${details.customerNotes.trim()}`);
  }

  lines.push(`────────────────────────────`);
  lines.push(`📦 *ITENS DO PEDIDO:*`);

  details.items.forEach((item, index) => {
    const unitPrice = item.product.promotional_price ?? item.product.price;
    const itemTotal = unitPrice * item.quantity;
    lines.push(
      `${index + 1}. *${item.product.name}*\n` +
      `   • Tamanho: *${item.variant.size}* | Cor: *${item.variant.color}*\n` +
      `   • SKU: \`${item.variant.sku}\`\n` +
      `   • Qtd: ${item.quantity} x ${formatCurrency(unitPrice)} = *${formatCurrency(itemTotal)}*`
    );
  });

  lines.push(`────────────────────────────`);
  lines.push(`💰 *SUBTOTAL:* *${formatCurrency(details.subtotal)}*`);
  lines.push(`ℹ️ *Entrega:* Modalidade e custo a serem confirmados pela loja.`);
  lines.push(`────────────────────────────`);
  lines.push(`Olá! Acabei de montar meu pedido pelo site da Click Modas 25 e gostaria de confirmar a disponibilidade e o valor do frete para envio/retirada.`);

  return lines.join("\n");
}

export function buildWhatsAppLink(
  phoneNumber: string = DEFAULT_WHATSAPP_NUMBER,
  details: WhatsAppOrderDetails
): string {
  const message = generateWhatsAppMessage(details);
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildDirectProductWhatsAppLink(
  phoneNumber: string = DEFAULT_WHATSAPP_NUMBER,
  productName: string,
  variantSize?: string,
  variantColor?: string,
  price?: number
): string {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  let message = `Olá, Click Modas 25! Gostei muito de *${productName}*`;
  if (variantSize || variantColor) {
    message += ` (Tamanho: ${variantSize || "a definir"}, Cor: ${variantColor || "a definir"})`;
  }
  if (price) {
    message += ` no valor de ${formatCurrency(price)}`;
  }
  message += `. Poderia me passar mais detalhes sobre disponibilidade e entrega?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
