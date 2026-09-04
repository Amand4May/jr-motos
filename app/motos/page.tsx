import type { Metadata } from "next";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WhatsappFloat } from "../components/WhatsappFloat";
import { MotosFiltro } from "./MotosFiltro";
import { getTodasMotos } from "@/lib/motos";

export const metadata: Metadata = {
  title: "Motos à venda — JR Motos",
  description: "Confira todas as motos disponíveis na JR Motos.",
};

export default async function MotosPage() {
  const motos = await getTodasMotos();

  return (
    <>
      <Header />

      <section className="bg-jr-black pb-16 pt-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="max-w-lg">
            <div className="mb-2.5 font-heading text-sm font-semibold tracking-wide text-jr-red">
              Estoque completo
            </div>
            <h1 className="font-heading text-3xl font-semibold leading-tight text-jr-offwhite sm:text-4xl">
              Motos à venda
            </h1>
            <p className="mt-3 max-w-md text-jr-steel-light">
              Toda moto passa por revisão antes de ir pro estoque. Clique numa
              que gostar e fale direto com a gente.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-jr-black pb-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          {motos.length > 0 ? (
            <MotosFiltro motos={motos} />
          ) : (
            <p className="text-jr-steel-light">
              Nenhuma moto cadastrada no momento. Volte em breve!
            </p>
          )}
        </div>
      </section>

      <Footer />
      <WhatsappFloat />
    </>
  );
}
