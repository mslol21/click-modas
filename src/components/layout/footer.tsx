import React from "react";
import Link from "next/link";
import { Phone, Instagram, MapPin, ShieldCheck, Heart, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-brand-pinkLight/30 text-brand-dark pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-brand-purple">
                CLICK MODAS
              </span>
              <span className="bg-brand-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
                25
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Especialistas em moda infantil delicada e confortável do tamanho 2 ao 16. Atendimento exclusivo e humanizado com finalização prática pelo WhatsApp.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com/clickmodas_kids"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white shadow-sm border flex items-center justify-center text-brand-purple hover:bg-brand-purple hover:text-white transition-all"
                aria-label="Instagram da Click Modas 25"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5511954686239"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white shadow-sm border flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                aria-label="WhatsApp da Click Modas 25"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-wide text-brand-dark uppercase">
              Categorias Infantis
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/catalogo?categoria=vestidos-infantis" className="hover:text-brand-purple transition-colors">
                  Vestidos Infantis
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=conjuntos-menina" className="hover:text-brand-purple transition-colors">
                  Conjuntos Menina
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=conjuntos-menino" className="hover:text-brand-purple transition-colors">
                  Conjuntos Menino
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=linha-bebe" className="hover:text-brand-purple transition-colors">
                  Linha Bebê
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-brand-purple transition-colors">
                  Ver Todas as Peças
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-wide text-brand-dark uppercase">
              Informações & Dúvidas
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/guia-de-medidas" className="hover:text-brand-purple transition-colors">
                  Tabela e Guia de Medidas
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-brand-purple transition-colors">
                  Sobre a Click Modas 25
                </Link>
              </li>
              <li>
                <Link href="/entregas" className="hover:text-brand-purple transition-colors">
                  Entregas e Retiradas
                </Link>
              </li>
              <li>
                <Link href="/trocas-devolucoes" className="hover:text-brand-purple transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-brand-purple transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-brand-purple transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Location & Direct Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-wide text-brand-dark uppercase">
              Atendimento Oficial
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                <span>
                  Avenida Doutor Guilherme Abreu Sodre, 94 — CEP 08490-010 — São Paulo, SP
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-dark">(11) 95468-6239</p>
                  <p className="text-xs">Atendimento e pedidos pelo WhatsApp</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-lilac shrink-0 mt-0.5" />
                <span>Modalidade e frete confirmados diretamente no atendimento.</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-brand-purple transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Painel Administrativo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Click Modas 25 — Todos os direitos reservados. Moda Infantil 2 ao 16.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-brand-pink fill-brand-pink inline" /> para crianças e famílias
          </p>
        </div>
      </div>
    </footer>
  );
}
