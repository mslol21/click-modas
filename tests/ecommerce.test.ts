import { describe, it, expect } from "vitest";
import { generateWhatsAppMessage, buildDirectProductWhatsAppLink } from "../src/lib/whatsapp";
import { formatCurrency, cleanPhone } from "../src/lib/utils";
import { createOrderIntention, updateVariantStock } from "../src/lib/data";
import {
  checkoutFormSchema,
  productFormSchema,
  stockAdjustmentSchema,
} from "../src/lib/validations";

describe("E-Commerce Click Modas 25 - Suite de Testes", () => {
  // 1. WhatsApp Message Generation
  describe("Geração de Mensagem Estruturada WhatsApp", () => {
    it("deve gerar mensagem completa e legível com código, itens, tamanhos e subtotal", () => {
      const mockOrderDetails = {
        orderNumber: "CMD-20261014-9999",
        customerName: "Camila Ribeiro",
        customerPhone: "11999998888",
        deliveryMethod: "retirada_galeria_arco_iris",
        deliveryMethodLabel: "Retirada na Galeria Arco-Íris (São Paulo)",
        customerNotes: "Favor embalar para presente",
        subtotal: 149.8,
        items: [
          {
            id: "item-1",
            product: {
              id: "prod-1",
              name: "Vestido Floral Jardim Secreto",
              price: 79.9,
              promotional_price: 69.9,
              slug: "vestido-floral",
              category_id: null,
              description: null,
              sku_base: "CMD-VES-001",
              is_published: true,
              is_featured: true,
              created_at: "",
              updated_at: "",
            },
            variant: {
              id: "var-1",
              product_id: "prod-1",
              size: "6",
              color: "Rosa Floral",
              color_hex: "#E88CB8",
              sku: "CMD-VES-001-6-ROS",
              stock: 10,
              created_at: "",
              updated_at: "",
            },
            quantity: 2,
          },
        ],
      };

      const message = generateWhatsAppMessage(mockOrderDetails);

      expect(message).toContain("CLICK MODAS 25");
      expect(message).toContain("CMD-20261014-9999");
      expect(message).toContain("Camila Ribeiro");
      expect(message).toContain("Retirada na Galeria Arco-Íris");
      expect(message).toContain("Vestido Floral Jardim Secreto");
      expect(message).toContain("Tamanho: *6*");
      expect(message).toContain("Cor: *Rosa Floral*");
      expect(message).toContain("CMD-VES-001-6-ROS");
      expect(message).toContain("Favor embalar para presente");
      expect(message).toContain("SUBTOTAL:");
    });

    it("deve gerar link direto para tirar dúvidas no WhatsApp", () => {
      const link = buildDirectProductWhatsAppLink(
        "5511954686239",
        "Vestido Princesa Festa",
        "8",
        "Rosa Bebê",
        119.9
      );

      expect(link).toContain("https://wa.me/5511954686239");
      expect(link).toContain(encodeURIComponent("Vestido Princesa Festa"));
      expect(link).toContain(encodeURIComponent("Tamanho: 8"));
    });
  });

  // 2. Utils and formatting
  describe("Funções Utilitárias", () => {
    it("deve limpar caracteres de telefone corretamente", () => {
      expect(cleanPhone("(11) 95468-6239")).toBe("11954686239");
      expect(cleanPhone("+55 11 95468-6239")).toBe("5511954686239");
    });

    it("deve formatar moeda em padrão Real brasileiro", () => {
      const formatted = formatCurrency(79.9);
      expect(formatted).toContain("79,90");
    });
  });

  // 3. Order intention creation and stock bounds
  describe("Criação de Intenção de Pedido", () => {
    it("deve criar um pedido com código único e validar disponibilidade", async () => {
      const order = await createOrderIntention({
        customerName: "Ana Paula",
        customerPhone: "11988887777",
        deliveryMethod: "retirada_galeria_arco_iris",
        items: [
          {
            productId: "33333333-3333-3333-3333-333333333001",
            variantId: "var-001-1",
            quantity: 1,
          },
        ],
      });

      expect(order.order_number).toMatch(/^CMD-\d{8}-\d{4}$/);
      expect(order.status).toBe("pedido_iniciado");
      expect(order.customer_name).toBe("Ana Paula");
      expect(order.items?.length).toBe(1);
      expect(order.subtotal).toBeGreaterThan(0);
    });

    it("deve rejeitar pedido quando a quantidade ultrapassar o estoque", async () => {
      await expect(
        createOrderIntention({
          customerName: "Lucas",
          customerPhone: "11977778888",
          deliveryMethod: "combinar_envio",
          items: [
            {
              productId: "33333333-3333-3333-3333-333333333001",
              variantId: "var-001-1",
              quantity: 9999, // Excede estoque
            },
          ],
        })
      ).rejects.toThrow("Estoque insuficiente");
    });
  });

  // 4. Inventory adjustments and prevention of negative inventory
  describe("Controle de Estoque e Prevenção de Negativo", () => {
    it("deve permitir ajuste de estoque válido com motivo", async () => {
      const result = await updateVariantStock(
        "var-001-1",
        25,
        "Entrada da confecção"
      );
      expect(result.newStock).toBe(25);
      expect(result.reason).toBe("Entrada da confecção");
    });

    it("deve rejeitar estoque negativo", async () => {
      await expect(
        updateVariantStock("var-001-1", -5, "Ajuste incorreto")
      ).rejects.toThrow("O estoque não pode ser negativo");
    });
  });

  // 5. Zod Schemas Validation
  describe("Validações de Formulários com Zod", () => {
    it("deve aprovar dados de checkout válidos", () => {
      const valid = checkoutFormSchema.safeParse({
        customerName: "Mariana Silva",
        customerPhone: "(11) 98765-4321",
        deliveryMethod: "retirada_galeria_arco_iris",
        customerNotes: "Sem observações",
      });
      expect(valid.success).toBe(true);
    });

    it("deve reprovar checkout com nome vazio ou telefone curto", () => {
      const invalid = checkoutFormSchema.safeParse({
        customerName: "",
        customerPhone: "123",
        deliveryMethod: "retirada_galeria_arco_iris",
      });
      expect(invalid.success).toBe(false);
    });

    it("deve validar dados de cadastro de produto e variantes", () => {
      const validProduct = productFormSchema.safeParse({
        name: "Vestido Princesa",
        categoryId: "cat-1",
        price: 99.9,
        variants: [
          { size: "6", color: "Azul", sku: "CMD-VES-001-6", stock: 10 },
        ],
      });
      expect(validProduct.success).toBe(true);
    });

    it("deve reprovar produto com preço zero ou sem variantes", () => {
      const invalidProduct = productFormSchema.safeParse({
        name: "Vestido",
        categoryId: "cat-1",
        price: 0,
        variants: [],
      });
      expect(invalidProduct.success).toBe(false);
    });
  });
});
