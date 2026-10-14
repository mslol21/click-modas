"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthChecking(false);
      return;
    }

    let active = true;
    const verify = async () => {
      const supabase = createClient();
      if (!supabase) {
        router.replace("/admin/login");
        return;
      }
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        if (active) router.replace("/admin/login");
        return;
      }
      const { data: role, error: roleError } = await supabase
        .from("admin_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "super_admin"])
        .limit(1)
        .maybeSingle();
      if (roleError || !role) {
        if (active) router.replace("/admin/login");
        return;
      }
      if (active) setIsAuthChecking(false);
    };
    setIsAuthChecking(true);
    void verify();
    return () => { active = false; };
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-muted/30">{children}</div>;
  }

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-semibold">
            Verificando credenciais de acesso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-muted/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
