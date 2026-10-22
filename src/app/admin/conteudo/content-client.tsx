"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Banner } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sliders, Plus, Trash2, CheckCircle2, Image as ImageIcon, FileText } from "lucide-react";
import { toast } from "sonner";
import { adminDb } from "@/lib/product-admin";

interface ContentClientProps {
  initialBanners: Banner[];
  initialInstitutional: {
    about: string;
    delivery: string;
    exchange: string;
    privacy: string;
    terms: string;
  };
}

export function ContentClient({
  initialBanners,
  initialInstitutional,
}: ContentClientProps) {
  // Banners state
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("/catalogo");
  const [isUploading, setIsUploading] = useState(false);
  const [isBannerSaving, setIsBannerSaving] = useState(false);
  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file=event.target.files?.[0]; if(!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){toast.error("Use JPG, PNG ou WebP.");return;}
    if(file.size>5*1024*1024){toast.error("Arquivo deve ter no máximo 5 MB.");return;}
    setIsUploading(true);
    try { const db=await adminDb(); const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg"; const key=`home/${crypto.randomUUID()}.${ext}`; const {error}=await db.storage.from("banners").upload(key,file,{contentType:file.type,upsert:false});if(error)throw error;const url=db.storage.from("banners").getPublicUrl(key).data.publicUrl;setNewImageUrl(url);toast.success("Imagem enviada ao Supabase."); }
    catch(error){toast.error(error instanceof Error?error.message:"Falha no envio.");}
    finally{setIsUploading(false);event.target.value="";}
  };

  // Institutional text states
  const [about, setAbout] = useState(initialInstitutional.about);
  const [delivery, setDelivery] = useState(initialInstitutional.delivery);
  const [exchange, setExchange] = useState(initialInstitutional.exchange);

  const [isSaving, setIsSaving] = useState(false);

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newTitle.trim()||!newImageUrl.trim()){toast.error("Informe título e imagem.");return;}
    if(isUploading)return;
    setIsBannerSaving(true);
    try {
      const db=await adminDb();
      const {data,error}=await db.from("banners").insert({title:newTitle.trim(),subtitle:newSubtitle.trim()||null,image_url:newImageUrl.trim(),link_url:newLinkUrl.trim()||"/catalogo",button_text:"Ver Coleção",sort_order:banners.length+1,is_active:true}).select("*").single();
      if(error)throw error;
      setBanners(prev=>[...prev,data as Banner]);setNewTitle("");setNewSubtitle("");setNewImageUrl("");
      toast.success("Banner salvo no Supabase.");
    } catch(error){toast.error(error instanceof Error?error.message:"Falha ao cadastrar banner.");}
    finally{setIsBannerSaving(false);}
  };

  const handleRemoveBanner = async (bannerId: string) => {
    if(!window.confirm("Excluir definitivamente este banner?"))return;
    try {const db=await adminDb();const {data,error}=await db.from("banners").delete().eq("id",bannerId).select("id");if(error)throw error;if(!data?.length)throw new Error("Exclusão não autorizada.");setBanners(prev=>prev.filter(b=>b.id!==bannerId));toast.success("Banner excluído do Supabase.");}
    catch(error){toast.error(error instanceof Error?error.message:"Falha ao excluir.");}
  };

  const handleToggleBanner = async (bannerId: string) => {
    const current=banners.find(b=>b.id===bannerId);if(!current)return;
    try {const db=await adminDb();const {data,error}=await db.from("banners").update({is_active:!current.is_active}).eq("id",bannerId).select("*").single();if(error)throw error;setBanners(prev=>prev.map(b=>b.id===bannerId?data as Banner:b));toast.success("Visibilidade atualizada no Supabase.");}
    catch(error){toast.error(error instanceof Error?error.message:"Falha ao atualizar.");}
  };

  const handleSaveInstitutional = async (e: React.FormEvent) => {
    e.preventDefault();setIsSaving(true);
    try {const db=await adminDb();const value={...initialInstitutional,about,delivery,exchange};const {error}=await db.from("store_settings").upsert({key:"institutional",value},{onConflict:"key"});if(error)throw error;toast.success("Textos institucionais salvos no Supabase.");}
    catch(error){toast.error(error instanceof Error?error.message:"Falha ao salvar textos.");}
    finally{setIsSaving(false);}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
          Conteúdo e Banners da Loja
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Personalize os destaques da página inicial e as informações institucionais.
        </p>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="banners" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Banners da Home</span>
          </TabsTrigger>
          <TabsTrigger value="institutional" className="gap-2">
            <FileText className="w-4 h-4" />
            <span>Páginas Institucionais</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Banners */}
        <TabsContent value="banners" className="space-y-6">
          {/* Add banner form */}
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Adicionar Novo Banner</CardTitle>
              <CardDescription className="text-xs">
                Configure fotos de capa e chamadas para a página inicial da Click Modas 25
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBanner} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Título Principal *</Label>
                    <Input
                      type="text"
                      required
                      placeholder="Ex: Coleção Festas Fim de Ano"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="rounded-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Subtítulo ou Chamada</Label>
                    <Input
                      type="text"
                      placeholder="Ex: Vestidos florais e conjuntos com preço especial"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      className="rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Imagem de Destaque *</Label>
                    <label className="mb-2 block cursor-pointer rounded-xl border-2 border-dashed border-brand-purple/40 p-3 text-center text-xs font-semibold hover:bg-muted/40">
                      {isUploading ? "Enviando imagem..." : "Selecionar imagem do celular ou computador"}
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleBannerUpload} disabled={isUploading||isBannerSaving} className="sr-only" />
                    </label>
                    <p className="text-[11px] text-muted-foreground mb-2">JPG, PNG ou WebP até 5 MB. Você também pode informar uma URL.</p>
                    <Input
                      type="url"
                      required
                      placeholder="URL da imagem (preenchida automaticamente após o envio)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="rounded-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Link de Destino</Label>
                    <Input
                      type="text"
                      placeholder="/catalogo?categoria=vestidos-infantis"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="rounded-full"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isUploading||isBannerSaving} className="rounded-full gap-2 text-xs font-bold">
                  <Plus className="w-4 h-4" />
                  <span>{isBannerSaving ? "Salvando..." : "Cadastrar Banner"}</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active banners list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <Card key={b.id} className="rounded-3xl border shadow-sm overflow-hidden flex flex-col">
                <div className="relative aspect-[16/9] w-full bg-muted">
                  <Image
                    src={b.image_url}
                    alt={b.title}
                    fill
                    sizes="500px"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={b.is_active ? "success" : "secondary"}>
                      {b.is_active ? "Ativo na Home" : "Inativo"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-brand-dark">{b.title}</h3>
                    {b.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{b.subtitle}</p>
                    )}
                    <p className="text-[11px] text-brand-purple font-mono mt-2">
                      Link: {b.link_url}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleBanner(b.id)}
                      className="rounded-full text-xs h-8"
                    >
                      {b.is_active ? "Ocultar" : "Ativar"}
                    </Button>
                    <button
                      onClick={() => handleRemoveBanner(b.id)}
                      className="text-muted-foreground hover:text-destructive p-2"
                      title="Excluir banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Institutional */}
        <TabsContent value="institutional">
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Edição de Textos Institucionais
              </CardTitle>
              <CardDescription className="text-xs">
                Mantenha atualizadas as informações sobre a loja, envios e políticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveInstitutional} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="inst-about" className="text-xs font-semibold">
                    Sobre a Click Modas 25 (Página /sobre)
                  </Label>
                  <textarea
                    id="inst-about"
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full rounded-2xl border border-input p-3 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inst-delivery" className="text-xs font-semibold">
                    Entregas e Retiradas na Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP (Página /entregas)
                  </Label>
                  <textarea
                    id="inst-delivery"
                    rows={4}
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                    className="w-full rounded-2xl border border-input p-3 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inst-exchange" className="text-xs font-semibold">
                    Trocas e Devoluções (Página /trocas-devolucoes)
                  </Label>
                  <textarea
                    id="inst-exchange"
                    rows={4}
                    value={exchange}
                    onChange={(e) => setExchange(e.target.value)}
                    className="w-full rounded-2xl border border-input p-3 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full gap-2 text-xs font-bold px-6 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSaving ? "Salvando..." : "Salvar Textos Institucionais"}</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
