import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildWhatsappLink } from "@/lib/whatsapp";

export function Header() {
  const whatsappLink = buildWhatsappLink(
    `Olá! Vim pelo site da ${SITE_CONFIG.nome} e gostaria de falar com vocês.`
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-1 border-jr-red bg-jr-black/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="JR Motos"
            width={46}
            height={46}
            className="h-[46px] w-[46px] rounded-full object-cover"
          />
          <span className="font-heading text-lg font-semibold tracking-wide text-jr-offwhite">
            {SITE_CONFIG.nome}
          </span>
        </Link>

        <nav className="hidden gap-8 md:flex">
          <Link
            href="/#servicos"
            className="font-heading text-sm font-medium tracking-wide text-jr-steel-light transition-colors hover:text-jr-offwhite"
          >
            Serviços
          </Link>
          <Link
            href="/motos"
            className="font-heading text-sm font-medium tracking-wide text-jr-steel-light transition-colors hover:text-jr-offwhite"
          >
            Motos à venda
          </Link>
          <Link
            href="/#sobre"
            className="font-heading text-sm font-medium tracking-wide text-jr-steel-light transition-colors hover:text-jr-offwhite"
          >
            Localização
          </Link>
        </nav>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="clip-corner-sm flex items-center gap-2 bg-jr-red px-5 py-2.5 pl-4.5 font-heading text-sm font-semibold text-jr-offwhite transition-colors hover:bg-jr-red-bright"
        >
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}
