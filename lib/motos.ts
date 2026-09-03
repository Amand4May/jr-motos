import { supabase } from "./supabase/client";
import type { Moto } from "./supabase/types";

export async function getMotosDisponiveis(): Promise<Moto[]> {
  const { data, error } = await supabase
    .from("motos")
    .select("*")
    .eq("status", "disponivel")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar motos:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTodasMotos(): Promise<Moto[]> {
  const { data, error } = await supabase
    .from("motos")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar motos:", error.message);
    return [];
  }
  return data ?? [];
}
