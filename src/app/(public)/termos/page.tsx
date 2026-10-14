import React from "react";
import { Metadata } from "next";
import { getInstitutional } from "@/lib/data";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso | Click Modas 25",
  description: "Termos e condições de uso da plataforma Click Modas 25.",
};

export default async function TermsPage() {
  const content = await getInstitutional();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pinkLight text-brand-purple text-xs font-semibold">
          <FileText className="w-4 h-4 text-brand-pink" />
          <span>Condições Gerais</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
          Termos de Uso
        </h1>
        <p className="text-sm text-muted-foreground">
          Regras para utilização da nossa vitrine virtual e geração de pedidos.
        </p>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm p-6 sm:p-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base text-brand-dark font-medium leading-relaxed">
          {content.terms}
        </p>

        <div className="space-y-3 pt-4 border-t text-xs">
          <h3 className="font-bold text-sm text-brand-dark">Disposições Operacionais:</h3>
          <p>
            1. <strong>Natureza da Plataforma:</strong> Este site atua como catálogo interativo e gerador de intenções de pedido para atendimento via WhatsApp.
          </p>
          <p>
            2. <strong>Confirmação de Disponibilidade:</strong> A inclusão de produtos na sacola não garante reserva de estoque até a confirmação pelo atendimento.
          </p>
          <p>
            3. <strong>Preços e Informações:</strong> Buscamos manter todas as informações sempre atualizadas. Em caso de divergências evidentes, prevalecerão os dados confirmados pela equipe da loja no momento do atendimento.
          </p>
        </div>
      </div>
    </div>
  );
}
