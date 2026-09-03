"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "../actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <form
      action={formAction}
      className="w-full max-w-sm rounded-lg bg-jr-panel p-8 shadow-xl"
    >
      <h1 className="mb-1 font-heading text-2xl font-semibold text-jr-offwhite">
        Painel JR Motos
      </h1>
      <p className="mb-7 text-sm text-jr-steel-light">Digite a senha para entrar.</p>

      <label className="mb-6 flex flex-col gap-2">
        <span className="text-sm font-medium text-jr-offwhite">Senha</span>
        <div className="relative">
          <input
            type={mostrarSenha ? "text" : "password"}
            name="password"
            required
            autoFocus
            className="w-full rounded-md border border-jr-steel bg-jr-black px-4 py-3.5 pr-12 text-lg text-jr-offwhite outline-none focus:border-jr-red"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha((v) => !v)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-jr-steel-light transition-colors hover:text-jr-offwhite"
          >
            {mostrarSenha ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </label>

      {state.error && (
        <p className="mb-5 rounded-md bg-jr-red/10 px-4 py-3 text-sm font-medium text-jr-red-bright">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="clip-corner-md w-full bg-jr-red py-3.5 font-heading text-lg font-semibold text-jr-offwhite transition-colors hover:bg-jr-red-bright disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
