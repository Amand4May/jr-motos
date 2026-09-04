export type MotoStatus = "disponivel" | "vendida";

export type Moto = {
  id: string;
  titulo: string;
  marca: string | null;
  cor: string | null;
  ano: number;
  km: number | null;
  preco: number;
  descricao: string | null;
  fotos: string[];
  status: MotoStatus;
  criado_em: string;
};

export type Database = {
  public: {
    Tables: {
      motos: {
        Row: Moto;
        Insert: Omit<Moto, "id" | "criado_em" | "status"> & {
          id?: string;
          criado_em?: string;
          status?: MotoStatus;
        };
        Update: Partial<Omit<Moto, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
