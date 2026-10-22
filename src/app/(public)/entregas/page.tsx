import React from "react";
import { Metadata } from "next";
import { getInstitutional } from "@/lib/data";
import { Truck, MapPin, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Entregas e Retiradas | Click Modas 25",
  description:
    "Saiba como funcionam os envios para todo o Brasil e a opção de retirada presencial na Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP.",
};

export default async function DeliveryPage() {
  const content = await getInstitutional();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pinkLight text-brand-purple text-xs font-semibold">
          <Truck className="w-4 h-4 text-brand-pink" />
          <span>Informações de Envio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
          Entregas e Retiradas
        </h1>
        <p className="text-sm text-muted-foreground">
          Transparência e agilidade na entrega dos seus pedidos infantis.
        </p>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm p-6 sm:p-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p className="text-base text-brand-dark font-medium leading-relaxed">
          {content.delivery}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div className="p-5 rounded-2xl bg-muted/30 border space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-brand-dark">
              <MapPin className="w-4 h-4 text-brand-purple" />
              <span>Retirada na Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP</span>
            </div>
            <p className="text-xs">
              Retire seu pedido diretamente em nossa loja. Sem taxa de frete, mediante agendamento após a confirmação.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-muted/30 border space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-brand-dark">
              <Truck className="w-4 h-4 text-brand-purple" />
              <span>Envio Nacional</span>
            </div>
            <p className="text-xs">
              Cotamos os Correios (PAC/Sedex) ou transportadora mais vantajosa para o seu CEP diretamente na conversa do WhatsApp.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            Deseja cotar o frete para a sua região agora mesmo?
          </span>
          <a
            href="https://wa.me/5511954686239"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="sm" className="rounded-full gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>Consultar no WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
