import React from "react";
import { Metadata } from "next";
import { getSizeGuide } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ruler, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Tabela e Guia de Medidas Infantil (2 ao 16)",
  description:
    "Confira a tabela oficial de medidas infantis da Click Modas 25 para os tamanhos do 2 ao 16. Dicas de como medir tórax, cintura e altura.",
};

export default async function SizeGuidePage() {
  const sizeGuide = await getSizeGuide();

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pinkLight text-brand-purple text-xs font-semibold">
          <Ruler className="w-4 h-4 text-brand-pink" />
          <span>Tabela Oficial Click Modas 25</span>
        </div>
        <h1 className="text-3xl font-extrabold text-brand-dark">
          Guia de Medidas Infantil (Tamanhos 2 ao 16)
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Sabemos o quanto acertar no tamanho das crianças é importante. Use as referências abaixo para escolher a peça perfeita.
        </p>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm p-6 space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Tamanho</TableHead>
              <TableHead>Idade Recomendada</TableHead>
              <TableHead>Tórax / Busto</TableHead>
              <TableHead>Cintura</TableHead>
              <TableHead>Altura Estimada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizeGuide.map((item) => (
              <TableRow key={item.size}>
                <TableCell className="font-extrabold text-brand-purple text-base">
                  Tam {item.size}
                </TableCell>
                <TableCell className="font-medium text-brand-dark">{item.age}</TableCell>
                <TableCell>{item.chest}</TableCell>
                <TableCell>{item.waist}</TableCell>
                <TableCell>{item.height}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-muted/40 border space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-brand-dark">
            <CheckCircle2 className="w-4 h-4 text-brand-purple" />
            <span>Como medir o tórax:</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Passe a fita métrica em volta da parte mais larga do peito da criança, mantendo a fita reta e confortável sem apertar.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-muted/40 border space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-brand-dark">
            <CheckCircle2 className="w-4 h-4 text-brand-purple" />
            <span>Como medir a cintura:</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Meça em torno da linha natural da cintura, logo acima do umbigo, permitindo espaço para movimentação livre.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-muted/40 border space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-brand-dark">
            <CheckCircle2 className="w-4 h-4 text-brand-purple" />
            <span>Dúvida entre tamanhos?</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Como as crianças crescem rápido, recomendamos escolher um tamanho maior para garantir maior tempo de uso e conforto.
          </p>
        </div>
      </div>
    </div>
  );
}
