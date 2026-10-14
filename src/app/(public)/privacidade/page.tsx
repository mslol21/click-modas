import React from "react";
import { Metadata } from "next";
import { getInstitutional } from "@/lib/data";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | Click Modas 25",
  description: "Entenda como a Click Modas 25 protege seus dados e respeita a sua privacidade.",
};

export default async function PrivacyPage() {
  const content = await getInstitutional();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pinkLight text-brand-purple text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-brand-pink" />
          <span>Segurança & LGPD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
          Política de Privacidade
        </h1>
        <p className="text-sm text-muted-foreground">
          Transparência sobre a coleta e tratamento mínimo dos seus dados.
        </p>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm p-6 sm:p-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base text-brand-dark font-medium leading-relaxed">
          {content.privacy}
        </p>

        <div className="space-y-3 pt-4 border-t text-xs">
          <h3 className="font-bold text-sm text-brand-dark">Princípios de Privacidade:</h3>
          <p>
            1. <strong>Coleta Mínima Necessária:</strong> Solicitamos apenas nome e número de telefone para identificação e comunicação sobre o seu pedido.
          </p>
          <p>
            2. <strong>Sem Dados de Pagamento no Site:</strong> Não coletamos dados de cartões de crédito, senhas bancárias ou dados financeiros sensíveis na plataforma.
          </p>
          <p>
            3. <strong>Direito do Titular:</strong> O cliente pode solicitar a qualquer momento a exclusão ou alteração de seus dados de cadastro entrando em contato com nosso atendimento.
          </p>
        </div>
      </div>
    </div>
  );
}
