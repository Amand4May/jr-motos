"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { MotoCard } from "../components/MotoCard";
import { formatMilhar } from "@/lib/format";
import type { Moto } from "@/lib/supabase/types";

const campoClass =
  "min-w-[140px] flex-1 rounded-md border border-[#333] bg-jr-panel px-4 py-3 text-sm text-jr-offwhite outline-none placeholder:text-jr-steel focus:border-jr-red";

export function MotosFiltro({ motos }: { motos: Moto[] }) {
  const marcas = useMemo(
    () =>
      Array.from(new Set(motos.map((m) => m.marca).filter((v): v is string => Boolean(v)))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [motos]
  );
  const cores = useMemo(
    () =>
      Array.from(new Set(motos.map((m) => m.cor).filter((v): v is string => Boolean(v)))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [motos]
  );
  const anos = useMemo(
    () => Array.from(new Set(motos.map((m) => m.ano))).sort((a, b) => b - a),
    [motos]
  );

  const [busca, setBusca] = useState("");
  const [marca, setMarca] = useState("");
  const [cor, setCor] = useState("");
  const [ano, setAno] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  const precoMinNum = precoMin ? Number(precoMin.replace(/\D/g, "")) : null;
  const precoMaxNum = precoMax ? Number(precoMax.replace(/\D/g, "")) : null;

  const filtradas = motos.filter((moto) => {
    if (marca && moto.marca !== marca) return false;
    if (cor && moto.cor !== cor) return false;
    if (ano && moto.ano !== Number(ano)) return false;
    if (precoMinNum != null && moto.preco < precoMinNum) return false;
    if (precoMaxNum != null && moto.preco > precoMaxNum) return false;
    if (busca && !moto.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const filtrosAtivos = Boolean(busca || marca || cor || ano || precoMin || precoMax);

  function limparFiltros() {
    setBusca("");
    setMarca("");
    setCor("");
    setAno("");
    setPrecoMin("");
    setPrecoMax("");
  }

  function handlePrecoChange(setter: (valor: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "");
      setter(digits ? formatMilhar(Number(digits)) : "");
    };
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por modelo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={`${campoClass} min-w-[200px] basis-full sm:basis-auto`}
        />
        <select value={marca} onChange={(e) => setMarca(e.target.value)} className={campoClass}>
          <option value="">Todas as marcas</option>
          {marcas.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select value={cor} onChange={(e) => setCor(e.target.value)} className={campoClass}>
          <option value="">Todas as cores</option>
          {cores.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={ano} onChange={(e) => setAno(e.target.value)} className={campoClass}>
          <option value="">Todos os anos</option>
          {anos.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Preço mín. (R$)"
          value={precoMin}
          onChange={handlePrecoChange(setPrecoMin)}
          className={campoClass}
        />
        <input
          type="text"
          inputMode="numeric"
          placeholder="Preço máx. (R$)"
          value={precoMax}
          onChange={handlePrecoChange(setPrecoMax)}
          className={campoClass}
        />
        {filtrosAtivos && (
          <button
            type="button"
            onClick={limparFiltros}
            className="rounded-md border border-jr-steel px-4 py-3 text-sm font-semibold text-jr-steel-light transition-colors hover:border-jr-offwhite hover:text-jr-offwhite"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <p className="mb-8 text-sm text-jr-steel-light">
        {filtradas.length}{" "}
        {filtradas.length === 1 ? "moto encontrada" : "motos encontradas"}
      </p>

      {filtradas.length > 0 ? (
        <div className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((moto) => (
            <MotoCard key={moto.id} moto={moto} />
          ))}
        </div>
      ) : (
        <p className="text-jr-steel-light">Nenhuma moto encontrada com esses filtros.</p>
      )}
    </div>
  );
}
