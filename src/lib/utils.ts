// =============================================================
// PALITOT · Utilitários
// =============================================================

/**
 * Formata uma data ISO (YYYY-MM-DD) em formato legível e emocional
 * Ex: "1994-01-15" → "Janeiro de 1994"
 */
export function formatMemoryDate(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return `${months[month - 1]} de ${year}`;
}

/**
 * Formata data de comentário relativa
 * Ex: "há 2 dias", "há 1 mês"
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "hoje";
  if (diffDays === 1) return "ontem";
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? "s" : ""}`;
  if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? "es" : ""}`;
  return `há ${Math.floor(diffDays / 365)} ano${Math.floor(diffDays / 365) > 1 ? "s" : ""}`;
}

/**
 * Gera slug a partir de um título
 * Ex: "Nossa viagem ao mar" → "nossa-viagem-ao-mar"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Trunca texto em número de palavras
 */
export function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

/**
 * Extrai inicial do nome para avatar
 */
export function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}
