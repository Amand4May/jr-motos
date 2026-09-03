import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { MotoForm } from "../../components/MotoForm";
import { createMoto } from "../../actions";

export default async function NovaMotoPage() {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin");

  return (
    <div className="min-h-screen bg-jr-offwhite">
      <header className="bg-jr-black px-6 py-5">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin"
            className="text-sm font-medium text-jr-steel-light transition-colors hover:text-jr-offwhite"
          >
            ← Voltar ao painel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-lg bg-white p-6 sm:p-8">
          <h1 className="mb-6 font-heading text-2xl font-semibold text-jr-black">
            Cadastrar moto nova
          </h1>
          <MotoForm action={createMoto} submitLabel="Publicar" />
        </div>
      </main>
    </div>
  );
}
