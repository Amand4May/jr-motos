"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { Moto } from "@/lib/supabase/types";
import { formatKm, formatPreco } from "@/lib/format";
import { marcarDisponivel, marcarVendida, removerMoto } from "../actions";

export function MotoList({ motos }: { motos: Moto[] }) {
  const [isPending, startTransition] = useTransition();

  if (motos.length === 0) {
    return <p className="text-jr-steel">Nenhuma moto cadastrada ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {motos.map((moto) => {
        const km = formatKm(moto.km);
        return (
          <div
            key={moto.id}
            className="flex flex-col gap-4 rounded-lg bg-white p-5 sm:flex-row sm:items-center"
          >
            <div className="h-24 w-32 shrink-0 overflow-hidden rounded bg-jr-border">
              {moto.fotos[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={moto.fotos[0]}
                  alt={moto.titulo}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-lg font-semibold text-jr-black">
                  {moto.titulo}
                </h3>
                <span
                  className={`clip-corner-sm px-2.5 py-1 text-xs font-semibold text-jr-offwhite ${
                    moto.status === "vendida" ? "bg-jr-steel" : "bg-jr-red"
                  }`}
                >
                  {moto.status === "vendida" ? "Vendida" : "Disponível"}
                </span>
              </div>
              <p className="text-sm text-jr-steel">
                {moto.ano}
                {km ? ` · ${km}` : ""} · {formatPreco(moto.preco)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href={`/admin/motos/${moto.id}`}
                className="rounded-md border border-jr-black px-4 py-2.5 text-sm font-semibold text-jr-black transition-colors hover:bg-jr-black hover:text-jr-offwhite"
              >
                Editar
              </Link>
              {moto.status === "vendida" ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => marcarDisponivel(moto.id))}
                  className="rounded-md border border-jr-steel px-4 py-2.5 text-sm font-semibold text-jr-steel transition-colors hover:bg-jr-steel hover:text-jr-offwhite disabled:opacity-50"
                >
                  Voltar para venda
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => marcarVendida(moto.id))}
                  className="rounded-md border border-jr-steel px-4 py-2.5 text-sm font-semibold text-jr-steel transition-colors hover:bg-jr-steel hover:text-jr-offwhite disabled:opacity-50"
                >
                  Marcar como vendida
                </button>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (confirm(`Remover "${moto.titulo}" definitivamente?`)) {
                    startTransition(() => removerMoto(moto.id));
                  }
                }}
                className="rounded-md border border-jr-red px-4 py-2.5 text-sm font-semibold text-jr-red transition-colors hover:bg-jr-red hover:text-jr-offwhite disabled:opacity-50"
              >
                Remover
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
