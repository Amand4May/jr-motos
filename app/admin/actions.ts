"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  setAdminSession,
  clearAdminSession,
  isAdminAuthed,
} from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Senha incorreta. Tente novamente." };
  }
  await setAdminSession();
  redirect("/admin");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin");
}

export type MotoFormState = { error?: string };

async function requireAuthed() {
  if (!(await isAdminAuthed())) {
    redirect("/admin");
  }
}

function revalidarSite() {
  revalidatePath("/");
  revalidatePath("/motos");
  revalidatePath("/admin");
}

const LIMITE_MOTOS_VENDIDAS = 20;

async function apagarFotosStorage(admin: SupabaseClient<Database>, fotos: string[]) {
  const paths = fotos
    .map((url) => url.split("/motos/").pop())
    .filter((p): p is string => Boolean(p));
  if (paths.length) await admin.storage.from("motos").remove(paths);
}

async function apagarVendidaMaisAntigaSeExceder(admin: SupabaseClient<Database>) {
  const { count } = await admin
    .from("motos")
    .select("id", { count: "exact", head: true })
    .eq("status", "vendida");

  if (!count || count < LIMITE_MOTOS_VENDIDAS) return;

  const { data: maisAntiga } = await admin
    .from("motos")
    .select("id, fotos")
    .eq("status", "vendida")
    .order("criado_em", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!maisAntiga) return;

  if (maisAntiga.fotos?.length) await apagarFotosStorage(admin, maisAntiga.fotos);
  await admin.from("motos").delete().eq("id", maisAntiga.id);
}

export type UploadAssinadoState = { path: string; token: string } | { error: string };

// Gera uma URL de upload assinada e temporária: o navegador do usuário envia a foto
// direto pro Supabase Storage, sem passar o arquivo pelo servidor (evita o limite de
// tamanho de payload das Server Actions/funções serverless).
export async function criarUploadAssinado(nomeArquivo: string): Promise<UploadAssinadoState> {
  await requireAuthed();

  const ext = nomeArquivo.split(".").pop() || "jpg";
  const path = `${randomUUID()}.${ext}`;

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("motos").createSignedUploadUrl(path);
  if (error || !data) {
    return { error: `Falha ao preparar envio da foto: ${error?.message ?? "erro desconhecido"}` };
  }

  return { path: data.path, token: data.token };
}

function parseMotoFields(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const marca = String(formData.get("marca") ?? "").trim();
  const cor = String(formData.get("cor") ?? "").trim();
  const ano = Number(formData.get("ano"));
  const kmRaw = String(formData.get("km") ?? "").trim();
  const preco = Number(formData.get("preco"));
  const descricao = String(formData.get("descricao") ?? "").trim();

  if (!titulo) {
    return { error: "Informe o título da moto (ex: Honda CG 160 Titan)." } as const;
  }
  if (!marca) {
    return { error: "Informe a marca da moto." } as const;
  }
  if (!cor) {
    return { error: "Informe a cor da moto." } as const;
  }
  if (!Number.isFinite(ano) || ano < 1950 || ano > new Date().getFullYear() + 1) {
    return { error: "Informe um ano válido." } as const;
  }
  let km: number | null = null;
  if (kmRaw) {
    km = Number(kmRaw);
    if (!Number.isFinite(km) || km < 0) {
      return { error: "Informe uma quilometragem válida." } as const;
    }
  }
  if (!Number.isFinite(preco) || preco <= 0) {
    return { error: "Informe um preço válido." } as const;
  }

  const fotos = formData
    .getAll("fotos")
    .filter((f): f is string => typeof f === "string" && f.trim() !== "");

  return {
    data: { titulo, marca, cor, ano, km, preco, descricao: descricao || null, fotos },
  } as const;
}

export async function createMoto(
  _prevState: MotoFormState,
  formData: FormData
): Promise<MotoFormState> {
  await requireAuthed();

  const parsed = parseMotoFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  if (parsed.data.fotos.length === 0) {
    return { error: "Adicione pelo menos uma foto da moto." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("motos").insert(parsed.data);
  if (error) return { error: `Erro ao salvar: ${error.message}` };

  await apagarVendidaMaisAntigaSeExceder(admin);

  revalidarSite();
  redirect("/admin");
}

export async function updateMoto(
  id: string,
  _prevState: MotoFormState,
  formData: FormData
): Promise<MotoFormState> {
  await requireAuthed();

  const parsed = parseMotoFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  if (parsed.data.fotos.length === 0) {
    return { error: "A moto precisa de pelo menos uma foto." };
  }

  const admin = createAdminClient();

  const { data: atual } = await admin.from("motos").select("fotos").eq("id", id).single();
  const fotosRemovidas = (atual?.fotos ?? []).filter((url) => !parsed.data.fotos.includes(url));
  if (fotosRemovidas.length) await apagarFotosStorage(admin, fotosRemovidas);

  const { error } = await admin.from("motos").update(parsed.data).eq("id", id);
  if (error) return { error: `Erro ao salvar: ${error.message}` };

  revalidarSite();
  redirect("/admin");
}

export async function marcarVendida(id: string) {
  await requireAuthed();
  const admin = createAdminClient();
  await admin.from("motos").update({ status: "vendida" }).eq("id", id);
  revalidarSite();
}

export async function marcarDisponivel(id: string) {
  await requireAuthed();
  const admin = createAdminClient();
  await admin.from("motos").update({ status: "disponivel" }).eq("id", id);
  revalidarSite();
}

export async function removerMoto(id: string) {
  await requireAuthed();
  const admin = createAdminClient();

  const { data: moto } = await admin.from("motos").select("fotos").eq("id", id).single();
  if (moto?.fotos?.length) await apagarFotosStorage(admin, moto.fotos);

  await admin.from("motos").delete().eq("id", id);
  revalidarSite();
}
