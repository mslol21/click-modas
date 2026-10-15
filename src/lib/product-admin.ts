"use client";
import { createClient } from "@/lib/supabase/client";

export async function adminDb() {
  const db = createClient();
  if (!db) throw new Error("Supabase não configurado.");
  const {data:{user},error} = await db.auth.getUser();
  if (error || !user) throw new Error("Entre novamente como administrador.");
  const {data:role,error:roleError} = await db.from("admin_roles").select("user_id").eq("user_id",user.id).maybeSingle();
  if (roleError || !role) throw new Error("Acesso restrito a administradores.");
  return db;
}

export async function uploadProductPhoto(file: File): Promise<string> {
  if (!["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error("Use JPG, PNG ou WebP.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Imagem deve ter no máximo 5 MB.");
  const db = await adminDb();
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `catalog/${crypto.randomUUID()}.${ext}`;
  const {error} = await db.storage.from("products").upload(key,file,{contentType:file.type,upsert:false});
  if (error) throw new Error("Erro ao enviar imagem: "+error.message);
  return db.storage.from("products").getPublicUrl(key).data.publicUrl;
}

export interface ProductFormPayload {
  name:string; category_id:string|null; description:string|null; price:number;
  promotional_price:number|null; sku_base:string|null; is_published:boolean; is_featured:boolean;
}
export interface ProductVariantPayload { id?:string; size:string; color:string; sku:string; stock:number; }

export async function saveProduct(data:ProductFormPayload,variants:ProductVariantPayload[],images:string[],id?:string) {
  const db=await adminDb();
  if (!data.name.trim() || !Number.isFinite(data.price) || data.price<0) throw new Error("Nome e preço válido são obrigatórios.");
  if (!variants.length || variants.some(v=>!v.size.trim() || !v.sku.trim() || !Number.isSafeInteger(v.stock) || v.stock<0)) throw new Error("Confira os tamanhos, SKUs e estoque.");
  const slug=data.name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "produto";
  let productId=id;
  if (id) {
    const {data:updated,error}=await db.from("products").update(data).eq("id",id).select("id").single();
    if(error) throw new Error("Falha ao atualizar produto: "+error.message);
    productId=updated.id;
  } else {
    const {data:created,error}=await db.from("products").insert({...data,slug:slug+"-"+crypto.randomUUID().slice(0,8)}).select("id").single();
    if(error) throw new Error("Falha ao cadastrar produto: "+error.message);
    productId=created.id;
  }
  if (!productId) throw new Error("Produto não identificado.");
  const {data:existing,error:readError}=await db.from("product_variants").select("id").eq("product_id",productId);
  if(readError) throw new Error(readError.message);
  const retained=variants.filter(v=>v.id && !v.id.startsWith("var-")).map(v=>v.id!);
  const removed=(existing??[]).filter(v=>!retained.includes(v.id)).map(v=>v.id);
  if(removed.length){const {error}=await db.from("product_variants").delete().in("id",removed);if(error)throw new Error("Falha ao remover tamanhos: "+error.message);}
  for(const v of variants) {
    const payload={product_id:productId,size:v.size,color:v.color,sku:v.sku,stock:v.stock};
    if(v.id && !v.id.startsWith("var-")) {
      const {error}=await db.from("product_variants").update(payload).eq("id",v.id);
      if(error)throw new Error("Falha ao atualizar tamanho: "+error.message);
    } else {
      const {error}=await db.from("product_variants").insert(payload);
      if(error)throw new Error("Falha ao cadastrar tamanho: "+error.message);
    }
  }
  const {data:currentImages,error:imagesError}=await db.from("product_images").select("id,image_url").eq("product_id",productId);
  if(imagesError)throw new Error(imagesError.message);
  const obsolete=(currentImages??[]).filter(i=>!images.includes(i.image_url)).map(i=>i.id);
  if(obsolete.length){const {error}=await db.from("product_images").delete().in("id",obsolete);if(error)throw new Error(error.message);}
  for(let i=0;i<images.length;i++){
    const url=images[i];if(!url.startsWith("https://"))throw new Error("Endereço da imagem inválido.");
    const current=(currentImages??[]).find(im=>im.image_url===url);
    if(current){
      const {error}=await db.from("product_images").update({sort_order:i,is_cover:i===0}).eq("id",current.id);
      if(error)throw new Error(error.message);
    } else {
      const {error}=await db.from("product_images").insert({product_id:productId,image_url:url,sort_order:i,is_cover:i===0,alt_text:data.name});
      if(error)throw new Error(error.message);
    }
  }
  return productId;
}
