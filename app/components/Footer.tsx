import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t-2 border-jr-red bg-jr-black py-14 text-jr-steel-light">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-10 border-b border-[#262626] pb-10">
          <div className="flex items-center gap-3.5">
            <Image
              src="/logo.png"
              alt="JR Motos"
              width={52}
              height={52}
              className="h-[52px] w-[52px] rounded-full object-cover"
            />
            <span className="font-heading text-xl font-semibold text-jr-offwhite">
              {SITE_CONFIG.nome}
            </span>
          </div>

          <div className="flex flex-wrap gap-16">
            <div>
              <h4 className="mb-3.5 font-heading text-sm font-semibold tracking-wide text-jr-offwhite">
                Navegação
              </h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/#servicos" className="hover:text-jr-offwhite">
                  Serviços
                </Link>
                <Link href="/motos" className="hover:text-jr-offwhite">
                  Motos à venda
                </Link>
                <Link href="/#sobre" className="hover:text-jr-offwhite">
                  Localização
                </Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3.5 font-heading text-sm font-semibold tracking-wide text-jr-offwhite">
                Contato
              </h4>
              <div className="flex flex-col gap-2 text-sm">
                <p>{SITE_CONFIG.telefoneExibicao}</p>
                <p>{SITE_CONFIG.endereco}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-6 text-[0.82rem] text-[#666]">
          <span className="flex items-center gap-3">
            © {new Date().getFullYear()} {SITE_CONFIG.nome}. Todos os direitos reservados.
            <Link
              href="/admin"
              aria-label="Área da oficina"
              className="text-[#444] transition-colors hover:text-[#666]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Link>
          </span>
          <span>
            Desenvolvido por{" "}
            <strong>
              <a
                href="https://amandamay-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-jr-red"
              >
                Amanda Mayumi
              </a>
            </strong>
          </span>
        </div>
      </div>
    </footer>
  );
}
