import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Product, Order } from "@/types/database";

export async function getAdminStats() { const [orders,products]=await Promise.all([getAllOrdersAdmin(),getAllProductsAdmin()]); const confirmed=["confirmado","pago","em_separacao","enviado","entregue"]; const paid=["pago","em_separacao","enviado","entregue"]; const lowStockVariants=products.flatMap(p=>(p.variants??[]).filter(v=>v.stock<=5).map(v=>({...v,productName:p.name}))); return {totalOrders:orders.length,initiatedOrders:orders.filter(o=>o.status==="pedido_iniciado").length,confirmedOrders:orders.filter(o=>confirmed.includes(o.status)).length,completedOrders:orders.filter(o=>o.status==="entregue").length,confirmedRevenue:orders.filter(o=>paid.includes(o.status)).reduce((sum,o)=>sum+Number(o.total),0),activeProducts:products.filter(p=>p.is_published).length,lowStockCount:lowStockVariants.length,lowStockVariants,recentOrders:orders.slice(0,5)}; }

export async function getAllProductsAdmin():Promise<Product[]> {
  const client=createServerSupabaseClient();
  if(!client) throw new Error("Supabase não configurado.");
  const {data:{user},error:authError}=await client.auth.getUser();
  if(authError||!user) throw new Error("Sessão de administrador não encontrada.");
  const {data:role,error:roleError}=await client.from("admin_roles").select("user_id").eq("user_id",user.id).maybeSingle();
  if(roleError||!role) throw new Error("Acesso restrito a administradores.");
  const {data,error}=await client.from("products").select("*, variants:product_variants(*), images:product_images(*), category:categories(*)").order("created_at",{ascending:false});
  if(error) throw new Error("Falha ao consultar produtos reais: "+error.message);
  return (data??[]) as Product[];
}

export async function getAllOrdersAdmin():Promise<Order[]> {
  const client=createServerSupabaseClient();
  if(!client) throw new Error("Supabase não configurado.");
  const {data:{user},error:authError}=await client.auth.getUser();
  if(authError||!user) throw new Error("Sessão de administrador não encontrada.");
  const {data:role,error:roleError}=await client.from("admin_roles").select("user_id").eq("user_id",user.id).maybeSingle();
  if(roleError||!role) throw new Error("Acesso restrito a administradores.");
  const {data,error}=await client.from("orders").select("*,items:order_items(*)").order("created_at",{ascending:false});
  if(error) throw new Error(error.message);
  return (data??[]) as Order[];
}

