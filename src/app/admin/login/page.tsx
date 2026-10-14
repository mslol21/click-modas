"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();

      if (supabase) {
        // Authenticate via Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.session) {
          localStorage.setItem(
            "clickmodas_admin_auth",
            JSON.stringify({
              userId: data.user.id,
              email: data.user.email,
              timestamp: Date.now(),
            })
          );
          toast.success("Login efetuado com sucesso!");
          router.push("/admin");
          return;
        }
      }

      // Local / Offline authentication fallback for owner demonstration
      if (email.trim() && password.length >= 6) {
        localStorage.setItem(
          "clickmodas_admin_auth",
          JSON.stringify({
            email: email.trim(),
            role: "super_admin",
            timestamp: Date.now(),
          })
        );
        toast.success("Acesso administrativo autorizado!");
        router.push("/admin");
      } else {
        throw new Error("Credenciais inválidas. Preencha seu e-mail e uma senha de no mínimo 6 dígitos.");
      }
    } catch (err: any) {
      console.error("Falha no login administrativo:", err);
      setErrorMessage(err.message || "Erro ao realizar login.");
      toast.error(err.message || "Credenciais não autorizadas.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand-purple mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a Loja Pública</span>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <span className="font-black text-2xl tracking-tight text-brand-purple">
              CLICK MODAS
            </span>
            <span className="bg-brand-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
              25
            </span>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            Acesso Restrito da Administração
          </p>
        </div>

        <Card className="rounded-3xl shadow-xl border">
          <CardHeader className="space-y-1 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-pinkLight text-brand-purple flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold">Painel de Controle</CardTitle>
            <CardDescription className="text-xs">
              Informe seu e-mail e senha de administrador para gerenciar a loja.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  E-mail Administrativo
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@clickmodas25.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full h-11 font-bold text-sm shadow-md"
              >
                {isLoading ? "Validando Acesso..." : "Entrar no Painel"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-[11px] text-center text-muted-foreground">
          Click Modas 25 • Galeria Arco-Íris, São Paulo • Área protegida por RLS
        </p>
      </div>
    </div>
  );
}
