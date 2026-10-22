import React from "react";
import { Metadata } from "next";
import { getInstitutional } from "@/lib/data";
import { Sparkles, MapPin, Heart, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre a Loja | Click Modas 25",
  description:
    "Conheça a história da Click Modas 25, referência em moda infantil do tamanho 2 ao 16 com loja na Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP.",
};

export default async function AboutPage() {
  const content = await getInstitutional();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pinkLight text-brand-purple text-xs font-semibold">
          <Heart className="w-4 h-4 text-brand-pink" />
          <span>Nossa História</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
          Sobre a Click Modas 25
        </h1>
        <p className="text-sm text-muted-foreground">
          Vestindo sorrisos e momentos especiais na infância.
        </p>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm p-6 sm:p-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base text-brand-dark font-medium leading-relaxed">
          {content.about}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div className="p-4 rounded-2xl bg-muted/40 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-brand-dark">
              <MapPin className="w-4 h-4 text-brand-purple" />
              <span>Nossa loja em São Paulo</span>
            </div>
            <p className="text-xs">
              Visite nossa loja na Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-brand-dark">
              <ShieldCheck className="w-4 h-4 text-brand-purple" />
              <span>Tamanhos 2 ao 16</span>
            </div>
            <p className="text-xs">
              Modelagens pensadas especificamente para o conforto e a liberdade de movimento das crianças.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
