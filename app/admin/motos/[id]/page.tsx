import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { MotoForm } from "../../components/MotoForm";
import { updateMoto } from "../../actions";

export default async function EditarMotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin");

  const admin = createAdminClient();
  const { data: moto } = await admin.from("motos").select("*").eq("id", id).single();

  if (!moto) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="mb-4 text-jr-black">Moto não encontrada.</p>
        <Link href="/admin" className="font-semibold text-jr-red">
          Voltar ao painel
        </Link>
      </div>
    );
  }

  const action = updateMoto.bind(null, id);

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
            Editar moto
          </h1>
          <MotoForm action={action} moto={moto} submitLabel="Salvar alterações" />
        </div>
      </main>
    </div>
  );
}
