import React from "react";
import { Metadata } from "next";
import { Phone, Instagram, MapPin, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Atendimento & Contato | Click Modas 25",
  description:
    "Fale com a Click Modas 25 pelo WhatsApp oficial +55 11 95468-6239 ou no Instagram @clickmodas_kids.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pinkLight text-brand-purple text-xs font-semibold">
          <MessageSquare className="w-4 h-4 text-brand-pink" />
          <span>Canais Oficiais</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
          Fale com a Click Modas 25
        </h1>
        <p className="text-sm text-muted-foreground">
          Estamos prontos para atender você, tirar dúvidas e separar o seu pedido com carinho.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl border shadow-sm p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-brand-dark">WhatsApp Comercial</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Canal principal para pedidos, cotação de frete e dúvidas.
            </p>
            <p className="text-lg font-extrabold text-brand-dark mt-2">
              (11) 95468-6239
            </p>
          </div>
          <a
            href="https://wa.me/5511954686239"
            target="_blank"
            rel="noopener noreferrer"
            className="block pt-2"
          >
            <Button variant="whatsapp" className="w-full rounded-full gap-2">
              <Phone className="w-4 h-4" />
              <span>Conversar Agora</span>
            </Button>
          </a>
        </div>

        <div className="bg-card rounded-3xl border shadow-sm p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-pinkLight text-brand-purple flex items-center justify-center">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-brand-dark">Instagram Oficial</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Fotos reais, bastidores e novidades frequentes.
            </p>
            <p className="text-lg font-extrabold text-brand-purple mt-2">
              @clickmodas_kids
            </p>
          </div>
          <a
            href="https://instagram.com/clickmodas_kids"
            target="_blank"
            rel="noopener noreferrer"
            className="block pt-2"
          >
            <Button variant="outline" className="w-full rounded-full gap-2">
              <Instagram className="w-4 h-4" />
              <span>Seguir no Instagram</span>
            </Button>
          </a>
        </div>
      </div>

      <div className="bg-muted/40 rounded-3xl border p-6 space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-brand-dark">Localização de Referência</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Galeria Arco-Íris, São Paulo - SP. Retiradas presenciais realizadas mediante confirmação e agendamento prévio após a separação das peças pelo WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
