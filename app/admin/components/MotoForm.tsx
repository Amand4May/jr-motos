"use client";

import { useActionState, useState, type ChangeEvent, type ReactNode } from "react";
import type { Moto } from "@/lib/supabase/types";
import { supabase } from "@/lib/supabase/client";
import { formatMilhar } from "@/lib/format";
import { criarUploadAssinado, type MotoFormState } from "../actions";

const initialState: MotoFormState = {};

const inputClass =
  "rounded-md border border-jr-border bg-white px-4 py-3.5 text-base text-jr-black outline-none focus:border-jr-red";

const MARCAS = [
  "Honda",
  "Yamaha",
  "Suzuki",
  "Kawasaki",
  "Dafra",
  "Shineray",
  "Haojue",
  "Bajaj",
  "Traxx",
  "BMW",
  "Harley-Davidson",
  "Royal Enfield",
];

const CORES = [
  "Preto",
  "Branco",
  "Vermelho",
  "Azul",
  "Cinza",
  "Prata",
  "Verde",
  "Amarelo",
  "Laranja",
];

export function MotoForm({
  action,
  moto,
  submitLabel,
}: {
  action: (state: MotoFormState, formData: FormData) => Promise<MotoFormState>;
  moto?: Moto;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [fotos, setFotos] = useState<string[]>(moto?.fotos ?? []);
  const [enviando, setEnviando] = useState(false);
  const [erroUpload, setErroUpload] = useState<string | null>(null);

  async function handleFotosChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setEnviando(true);
    setErroUpload(null);

    for (const file of files) {
      const resultado = await criarUploadAssinado(file.name);
      if ("error" in resultado) {
        setErroUpload(resultado.error);
        continue;
      }

      const { error } = await supabase.storage
        .from("motos")
        .uploadToSignedUrl(resultado.path, resultado.token, file, {
          contentType: file.type || "image/jpeg",
        });
      if (error) {
        setErroUpload(`Falha ao enviar "${file.name}": ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from("motos").getPublicUrl(resultado.path);
      setFotos((prev) => [...prev, data.publicUrl]);
    }

    setEnviando(false);
    e.target.value = "";
  }

  function removerFoto(url: string) {
    setFotos((prev) => prev.filter((f) => f !== url));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Campo label="Título">
        <input
          name="titulo"
          defaultValue={moto?.titulo}
          required
          placeholder="Ex: Honda CG 160 Titan"
          className={inputClass}
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <CampoComOutra
          name="marca"
          label="Marca"
          opcoes={MARCAS}
          defaultValue={moto?.marca ?? null}
          required
        />
        <CampoComOutra
          name="cor"
          label="Cor"
          opcoes={CORES}
          defaultValue={moto?.cor ?? null}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Ano">
          <input
            name="ano"
            type="number"
            inputMode="numeric"
            defaultValue={moto?.ano}
            required
            min={1950}
            max={new Date().getFullYear() + 1}
            className={inputClass}
          />
        </Campo>
        <CampoNumero
          name="km"
          label="Km rodados (opcional)"
          defaultValue={moto?.km ?? null}
          sufixo="km"
        />
      </div>

      <CampoNumero
        name="preco"
        label="Preço"
        defaultValue={moto?.preco ?? null}
        required
        prefixo="R$"
      />

      <Campo label="Descrição (opcional)">
        <textarea
          name="descricao"
          defaultValue={moto?.descricao ?? ""}
          rows={4}
          className={inputClass}
        />
      </Campo>

      <Campo label="Fotos da moto">
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={enviando}
          onChange={handleFotosChange}
          className="text-sm text-jr-black file:clip-corner-sm file:mr-4 file:border-0 file:bg-jr-red file:px-5 file:py-3 file:font-heading file:text-sm file:font-semibold file:text-jr-offwhite disabled:opacity-60"
        />
        <span className="text-xs text-jr-steel">
          Toque em &quot;Escolher arquivos&quot; para tirar uma foto na hora ou escolher fotos já
          salvas no celular.
        </span>
      </Campo>

      {enviando && <p className="text-sm text-jr-steel">Enviando foto(s)...</p>}

      {erroUpload && (
        <p className="rounded-md bg-jr-red/10 px-4 py-3 text-sm font-medium text-jr-red-bright">
          {erroUpload}
        </p>
      )}

      {fotos.length > 0 && (
        <div className="flex flex-col gap-2">
          {fotos.length === 1 && (
            <span className="text-xs text-jr-steel">
              A moto precisa de pelo menos 1 foto — envie outra antes de remover essa.
            </span>
          )}
          <div className="flex flex-wrap gap-3">
            {fotos.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-20 w-20 rounded object-cover" />
                {fotos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerFoto(url)}
                    aria-label="Remover foto"
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-jr-red text-sm font-bold leading-none text-jr-offwhite shadow"
                  >
                    ×
                  </button>
                )}
                <input type="hidden" name="fotos" value={url} />
              </div>
            ))}
          </div>
        </div>
      )}

      {state.error && (
        <p className="rounded-md bg-jr-red/10 px-4 py-3 text-sm font-medium text-jr-red-bright">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || enviando}
        className="clip-corner-lg bg-jr-red py-4 font-heading text-lg font-semibold text-jr-offwhite transition-colors hover:bg-jr-red-bright disabled:opacity-60"
      >
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-jr-black">{label}</span>
      {children}
    </label>
  );
}

function CampoNumero({
  name,
  label,
  defaultValue,
  required,
  prefixo,
  sufixo,
}: {
  name: string;
  label: string;
  defaultValue: number | null;
  required?: boolean;
  prefixo?: string;
  sufixo?: string;
}) {
  const [display, setDisplay] = useState(
    defaultValue != null ? formatMilhar(defaultValue) : ""
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    setDisplay(digits ? formatMilhar(Number(digits)) : "");
  }

  const raw = display.replace(/\D/g, "");

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-jr-black">{label}</span>
      <div className="relative">
        {prefixo && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-jr-steel">
            {prefixo}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          required={required}
          className={`${inputClass} w-full ${prefixo ? "pl-11" : ""} ${sufixo ? "pr-11" : ""}`}
        />
        {sufixo && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-jr-steel">
            {sufixo}
          </span>
        )}
      </div>
      <input type="hidden" name={name} value={raw} />
    </label>
  );
}

function CampoComOutra({
  name,
  label,
  opcoes,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  opcoes: string[];
  defaultValue: string | null;
  required?: boolean;
}) {
  const valorInicialConhecido = defaultValue && opcoes.includes(defaultValue);
  const [selecionado, setSelecionado] = useState(
    defaultValue ? (valorInicialConhecido ? defaultValue : "outra") : ""
  );

  return (
    <Campo label={label}>
      <select
        value={selecionado}
        onChange={(e) => setSelecionado(e.target.value)}
        required={required}
        name={selecionado === "outra" ? undefined : name}
        className={inputClass}
      >
        <option value="" disabled>
          Selecione
        </option>
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
        <option value="outra">Outra</option>
      </select>
      {selecionado === "outra" && (
        <input
          name={name}
          defaultValue={valorInicialConhecido ? "" : (defaultValue ?? "")}
          required={required}
          placeholder={`Digite a ${label.toLowerCase()}`}
          className={`${inputClass} mt-2`}
        />
      )}
    </Campo>
  );
}
