import React from "react";
import { Metadata } from "next";
import { getInstitutional } from "@/lib/data";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Trocas e Devoluções | Click Modas 25",
  description:
    "Orientações e prazos para trocas e devoluções de peças infantis na Click Modas 25.",
};

export default async function ExchangePage() {
  const content = await getInstitutional();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pinkLight text-brand-purple text-xs font-semibold">
          <RefreshCw className="w-4 h-4 text-brand-pink" />
          <span>Políticas da Loja</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
          Trocas e Devoluções
        </h1>
        <p className="text-sm text-muted-foreground">
          Garantindo a sua tranquilidade na escolha das roupinhas.
        </p>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm p-6 sm:p-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base text-brand-dark font-medium leading-relaxed">
          {content.exchange}
        </p>

        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-bold text-sm text-brand-dark">Condições Essenciais:</h3>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>A solicitação deve ser feita em até 7 dias corridos após o recebimento.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>As peças devem estar sem sinais de uso, lavagem ou odores.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Etiquetas de fábrica e embalagens preservadas.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
