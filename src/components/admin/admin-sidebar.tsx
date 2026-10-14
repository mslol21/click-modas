"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Sliders,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produtos", href: "/admin/produtos", icon: Package },
  { name: "Estoque", href: "/admin/estoque", icon: Boxes },
  { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { name: "Conteúdo & Banners", href: "/admin/conteudo", icon: Sliders },
  { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("clickmodas_admin_auth");
      sessionStorage.removeItem("clickmodas_admin_auth");
      router.push("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-brand-dark text-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-tight text-white">CLICK MODAS 25</span>
          <span className="bg-brand-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile drawer */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:block fixed lg:static inset-0 z-40 lg:z-auto w-64 bg-brand-dark text-white flex-shrink-0 flex flex-col justify-between p-6 transition-all`}
      >
        <div className="space-y-8">
          {/* Brand header */}
          <div className="hidden lg:flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  CLICK MODAS
                </span>
                <span className="bg-brand-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  25
                </span>
              </div>
              <p className="text-[11px] text-brand-lilac font-medium tracking-wider uppercase mt-0.5">
                Painel Administrativo
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-brand-purple text-white shadow-md"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>Ver Loja Pública</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>
    </>
  );
}
