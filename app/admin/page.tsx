import type { Metadata } from "next";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { LoginForm } from "./components/LoginForm";
import { MotoList } from "./components/MotoList";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Painel — JR Motos",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-jr-black px-6">
        <LoginForm />
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: motos, error } = await admin
    .from("motos")
    .select("*")
    .order("criado_em", { ascending: false });

  return (
    <div className="min-h-screen bg-jr-offwhite">
      <header className="bg-jr-black px-6 py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="font-heading text-xl font-semibold text-jr-offwhite">
            Painel JR Motos
          </h1>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-jr-steel-light transition-colors hover:text-jr-offwhite"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/admin/motos/nova"
            className="clip-corner-lg inline-flex items-center gap-2 bg-jr-red px-7 py-4 pl-6 font-heading text-lg font-semibold text-jr-offwhite transition-colors hover:bg-jr-red-bright"
          >
            + Cadastrar moto nova
          </Link>
        </div>

        <section>
          <h2 className="mb-6 font-heading text-2xl font-semibold text-jr-black">
            Motos cadastradas
          </h2>
          {error && (
            <p className="mb-4 text-jr-red">Erro ao carregar motos: {error.message}</p>
          )}
          <MotoList motos={motos ?? []} />
        </section>
      </main>
    </div>
  );
}
