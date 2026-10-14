import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-pinkLight text-brand-purple flex items-center justify-center mb-6 shadow-sm">
        <PackageSearch className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-purple bg-brand-pinkLight px-3 py-1 rounded-full">
          Página Não Encontrada (404)
        </span>
        <h1 className="text-3xl font-extrabold text-brand-dark">
          Ops! Não encontramos essa página
        </h1>
        <p className="text-sm text-muted-foreground">
          O produto que você procura pode ter esgotado ou o link digitado está incorreto.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link href="/">
          <Button variant="outline" className="rounded-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </Button>
        </Link>
        <Link href="/catalogo">
          <Button className="rounded-full gap-2 shadow-md">
            <Sparkles className="w-4 h-4 text-brand-pink" />
            <span>Ver Catálogo Completo</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
