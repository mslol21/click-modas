import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatWhatsAppMessage(text: string): string {
  return encodeURIComponent(text);
}
