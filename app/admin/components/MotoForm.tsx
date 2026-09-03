"use client";

import { useActionState, useState, type ChangeEvent, type ReactNode } from "react";
import type { Moto } from "@/lib/supabase/types";
import type { MotoFormState } from "../actions";

const initialState: MotoFormState = {};

const inputClass =
  "rounded-md border border-jr-border bg-white px-4 py-3.5 text-base text-jr-black outline-none focus:border-jr-red";

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
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFotosChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
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

      <Campo label={moto ? "Adicionar mais fotos (opcional)" : "Fotos da moto"}>
        <input
          name="fotos"
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          required={!moto}
          onChange={handleFotosChange}
          className="text-sm text-jr-black file:clip-corner-sm file:mr-4 file:border-0 file:bg-jr-red file:px-5 file:py-3 file:font-heading file:text-sm file:font-semibold file:text-jr-offwhite"
        />
      </Campo>

      {(moto?.fotos.length || previews.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {moto?.fotos.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="h-20 w-20 rounded object-cover" />
          ))}
          {previews.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt=""
              className="h-20 w-20 rounded object-cover ring-2 ring-jr-red"
            />
          ))}
        </div>
      )}

      {state.error && (
        <p className="rounded-md bg-jr-red/10 px-4 py-3 text-sm font-medium text-jr-red-bright">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
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

function formatMilhar(valor: number) {
  return valor.toLocaleString("pt-BR");
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
