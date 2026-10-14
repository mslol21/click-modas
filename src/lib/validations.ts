import { z } from "zod";

export const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .min(3, "O nome deve conter pelo menos 3 caracteres.")
    .max(100, "Nome muito longo."),
  customerPhone: z
    .string()
    .min(10, "Informe um telefone com DDD válido.")
    .regex(/^[0-9()\s-+]+$/, "Formato de telefone inválido."),
  deliveryMethod: z.enum([
    "retirada_galeria_arco_iris",
    "combinar_envio",
  ]),
  customerNotes: z.string().max(500, "A observação não pode exceder 500 caracteres.").optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(3, "Nome do produto é obrigatório."),
  categoryId: z.string().min(1, "Selecione uma categoria válida."),
  description: z.string().optional(),
  price: z.number().positive("O preço deve ser maior que zero."),
  promotionalPrice: z.number().positive().nullable().optional(),
  skuBase: z.string().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        size: z.string().min(1, "Tamanho obrigatório."),
        color: z.string().min(1, "Cor obrigatória."),
        sku: z.string().min(3, "SKU obrigatório."),
        stock: z.number().int().min(0, "Estoque não pode ser negativo."),
      })
    )
    .min(1, "Cadastre ao menos uma variante de tamanho."),
});

export const stockAdjustmentSchema = z.object({
  variantId: z.string().min(1, "Identificador da variante obrigatório."),
  newStock: z.number().int().min(0, "Estoque físico não pode ser negativo."),
  reason: z.string().min(3, "O motivo do ajuste é obrigatório."),
});
