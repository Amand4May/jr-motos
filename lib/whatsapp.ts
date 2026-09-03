import { SITE_CONFIG } from "./site-config";

export function buildWhatsappLink(mensagem: string) {
  return `https://wa.me/${SITE_CONFIG.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemInteresseMoto(titulo: string, ano: number) {
  return `Olá! Vi a ${titulo} (${ano}) no site da JR Motos e tenho interesse. Ainda está disponível?`;
}
