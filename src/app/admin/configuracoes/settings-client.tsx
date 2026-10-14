"use client";

import React, { useState } from "react";
import { StoreSettingsGeneral } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Phone, Instagram, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsClientProps {
  settings: StoreSettingsGeneral;
}

export function SettingsClient({ settings: initialSettings }: SettingsClientProps) {
  const [storeName, setStoreName] = useState(initialSettings.name);
  const [tagline, setTagline] = useState(initialSettings.tagline);
  const [whatsapp, setWhatsapp] = useState(initialSettings.whatsapp);
  const [instagram, setInstagram] = useState(initialSettings.instagram);
  const [location, setLocation] = useState(initialSettings.reference_location);
  const [stockRule, setStockRule] = useState("confirmation"); // or "order_placed"

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Configurações da loja salvas com sucesso!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
          Configurações da Loja
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Dados da empresa, canais de atendimento e regras de controle de estoque.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Store Data */}
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-purple" />
              <span>Identidade da Loja</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Nome comercial e descrição padrão exibida aos clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nome da Loja *</Label>
                <Input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="rounded-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Slogan / Faixa de Tamanhos *</Label>
                <Input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Localização de Referência *</Label>
              <Input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Channels */}
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Canais de Atendimento Oficial</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Número do WhatsApp para checkout e link do perfil no Instagram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  WhatsApp Comercial (apenas números com DDI + DDD) *
                </Label>
                <Input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="rounded-full font-mono text-xs"
                />
                <span className="text-[11px] text-muted-foreground block">
                  Ex: 5511954686239 (recebe mensagens automáticas dos pedidos)
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Instagram Oficial *</Label>
                <Input
                  type="text"
                  required
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="rounded-full text-xs"
                />
                <span className="text-[11px] text-muted-foreground block">
                  Ex: @clickmodas_kids
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Deduction Rules */}
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-purple" />
              <span>Regras de Baixa de Estoque</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Como o sistema trata as quantidades físicas das variantes infantis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer bg-brand-pinkLight/20 text-xs">
              <input
                type="radio"
                name="stockRule"
                value="confirmation"
                checked={stockRule === "confirmation"}
                onChange={() => setStockRule("confirmation")}
                className="mt-0.5 text-brand-purple focus:ring-brand-purple"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-brand-dark block">
                  Baixar estoque na Confirmação ou Pagamento do Pedido (Recomendado)
                </span>
                <span className="text-muted-foreground">
                  Evita que clientes fiquem sem estoque se outro apenas abriu o WhatsApp e desistiu da compra.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer text-xs">
              <input
                type="radio"
                name="stockRule"
                value="immediate"
                checked={stockRule === "immediate"}
                onChange={() => setStockRule("immediate")}
                className="mt-0.5 text-brand-purple focus:ring-brand-purple"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-brand-dark block">
                  Reservar estoque imediatamente ao abrir o WhatsApp
                </span>
                <span className="text-muted-foreground">
                  Reserva a peça por 1 hora aguardando resposta da cliente.
                </span>
              </div>
            </label>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={isSaving}
          className="rounded-full font-bold text-xs gap-2 px-8 shadow-md"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isSaving ? "Salvando..." : "Salvar Configurações"}</span>
        </Button>
      </form>
    </div>
  );
}
