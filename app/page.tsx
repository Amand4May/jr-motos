import Image from "next/image";
import Link from "next/link";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WhatsappFloat } from "./components/WhatsappFloat";
import { MotoCard } from "./components/MotoCard";
import { getMotosDisponiveis } from "@/lib/motos";
import { SITE_CONFIG } from "@/lib/site-config";
import { buildWhatsappLink } from "@/lib/whatsapp";

export default async function Home() {
  const motos = await getMotosDisponiveis();
  const destaques = motos.slice(0, 3);
  const whatsappLink = buildWhatsappLink(
    `Olá! Vim pelo site da ${SITE_CONFIG.nome} e gostaria de falar com vocês.`
  );

  return (
    <>
      <Header />

      <section className="relative flex min-h-screen items-center overflow-hidden bg-jr-black pt-20">
        <Image
          src="/jrmotosfachada2.png"
          alt="Fachada da oficina JR Motos"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-jr-black/70" />

        <div className="clip-diagonal-hero absolute inset-y-0 right-0 w-full bg-gradient-to-br from-jr-red to-jr-red-deep opacity-20 md:w-[56%] md:opacity-100">
          <Image
            src="/logo.png"
            alt=""
            width={420}
            height={420}
            priority
            className="absolute right-[6%] top-1/2 hidden h-auto w-[280px] -translate-y-1/2 drop-shadow-[0_30px_50px_rgba(0,0,0,0.45)] md:block md:w-[420px]"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8">
          <div className="max-w-xl">
            <div className="mb-4.5 font-heading text-sm font-semibold tracking-wide text-jr-red">
              Compra, Venda e Reparo de motos desde 1996
            </div>
            <h1 className="mb-5.5 font-heading text-4xl font-bold leading-[1.05] text-jr-offwhite sm:text-5xl">
              Sua moto em boas mãos. Sempre.
            </h1>
            <p className="mb-8.5 max-w-md text-jr-steel-light">
              Manutenção, revisão e venda de motos com procedência. Anos de
              oficina, agora também com as motos disponíveis pra você ver
              antes de vir até aqui.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/motos"
                className="clip-corner-lg inline-flex items-center gap-2.5 bg-jr-red px-7.5 py-3.5 pl-6.5 font-heading text-base font-semibold tracking-wide text-jr-offwhite transition-transform hover:-translate-y-0.5 hover:bg-jr-red-bright"
              >
                Ver motos disponíveis
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="clip-corner-lg inline-flex items-center gap-2.5 border-[1.5px] border-jr-steel-light px-7.5 py-3.5 pl-6.5 font-heading text-base font-semibold tracking-wide text-jr-offwhite transition-transform hover:-translate-y-0.5 hover:border-jr-offwhite"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="bg-jr-offwhite py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="mb-14 max-w-lg">
            <div className="mb-2.5 font-heading text-sm font-semibold tracking-wide text-jr-red">
              Serviços
            </div>
            <h2 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl">
              O que fazemos na oficina
            </h2>
          </div>

          <div className="grid grid-cols-1 border-t border-jr-border md:grid-cols-3">
            {SERVICOS.map((servico, index) => (
              <div
                key={servico.titulo}
                className={`border-b border-jr-border border-l-[3px] border-l-jr-red py-8.5 pl-6 pr-7.5 ${
                  index > 0 ? "md:ml-7.5" : ""
                }`}
              >
                <div
                  className="mb-4.5 h-8.5 w-8.5 text-jr-black"
                  dangerouslySetInnerHTML={{ __html: servico.icone }}
                />
                <h3 className="mb-2.5 text-lg font-semibold">{servico.titulo}</h3>
                <p className="text-sm text-[#555]">{servico.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="motos-destaque" className="bg-jr-black py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="max-w-lg">
            <div className="mb-2.5 font-heading text-sm font-semibold tracking-wide text-jr-red">
              Estoque atual
            </div>
            <h2 className="font-heading text-3xl font-semibold leading-tight text-jr-offwhite sm:text-4xl">
              Motos em destaque
            </h2>
            <p className="mt-3 max-w-md text-jr-steel-light">
              Toda moto passa por revisão antes de ir pro estoque. Clique numa
              que gostar e fale direto com a gente.
            </p>
          </div>

          {destaques.length > 0 ? (
            <div className="mt-12.5 grid grid-cols-1 gap-6.5 md:grid-cols-3">
              {destaques.map((moto) => (
                <MotoCard key={moto.id} moto={moto} />
              ))}
            </div>
          ) : (
            <p className="mt-12.5 text-jr-steel-light">
              Nenhuma moto cadastrada no momento. Volte em breve!
            </p>
          )}

          <div className="mt-12.5 text-center">
            <Link
              href="/motos"
              className="clip-corner-lg inline-block border-[1.5px] border-jr-steel px-9 py-3.5 pl-8 font-heading font-semibold tracking-wide text-jr-offwhite transition-colors hover:border-jr-offwhite"
            >
              Ver todas as motos
            </Link>
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-jr-offwhite py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 sm:px-8 md:grid-cols-2">
          <div>
            <div className="mb-2.5 font-heading text-sm font-semibold tracking-wide text-jr-red">
              Localização
            </div>
            <h2 className="mb-5.5 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
              Passa lá na oficina
            </h2>
            <p className="mb-7 max-w-md text-[#444]">
              Atendimento de segunda a sábado. Pode vir ver a moto
              pessoalmente antes de fechar negócio, ou levar a sua pra
              revisão.
            </p>
            <div className="flex flex-col gap-4.5">
              <InfoRow
                icone={<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />}
                circulo
                titulo="Endereço"
                valor={SITE_CONFIG.endereco}
              />
              <InfoRow
                icone={<path d="M12 6v6l4 2" />}
                circulo2
                titulo="Horário"
                valor={SITE_CONFIG.horario}
              />
              <InfoRow
                icone={
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.3-1.4a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
                }
                titulo="WhatsApp"
                valor={SITE_CONFIG.telefoneExibicao}
              />
            </div>
          </div>

          <div className="clip-map-panel relative aspect-square bg-jr-black">
            <iframe
              src={SITE_CONFIG.googleMapsEmbedUrl}
              title={`Mapa de localização da ${SITE_CONFIG.nome}`}
              width="600"
              height="450"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappFloat />
    </>
  );
}

function InfoRow({
  icone,
  circulo,
  circulo2,
  titulo,
  valor,
}: {
  icone: React.ReactNode;
  circulo?: boolean;
  circulo2?: boolean;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-5.5 w-5.5 shrink-0 stroke-jr-red"
      >
        {icone}
        {circulo && <circle cx="12" cy="10" r="3" />}
        {circulo2 && <circle cx="12" cy="12" r="10" />}
      </svg>
      <div>
        <strong className="block text-sm font-semibold">{titulo}</strong>
        <span className="text-sm text-[#555]">{valor}</span>
      </div>
    </div>
  );
}

const SERVICOS = [
  {
    titulo: "Manutenção geral",
    descricao:
      "Revisão completa, troca de óleo, freios, corrente e diagnóstico de problemas.",
    icone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  },
  {
    titulo: "Peças e reposição",
    descricao:
      "Peças originais e paralelas com garantia, aplicadas na hora ou sob encomenda.",
    icone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  },
  {
    titulo: "Compra e venda",
    descricao:
      "Avaliação justa na sua moto usada e motos revisadas prontas pra rodar.",
    icone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3v-6l2-5h9l4 5h3v6h-2M5 17a2 2 0 1 0 4 0M5 17a2 2 0 1 1 4 0m6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M9 17h6"/></svg>',
  },
];
