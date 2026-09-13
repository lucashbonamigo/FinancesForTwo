// Utilitários para gestão de competência mensal e datas

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

/**
 * Converte chave "YYYY-MM" para rótulo amigável em português (ex: "2026-10" -> "Outubro/2026")
 */
export function formatMonthLabel(monthKey: string): string {
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [yearStr, monthStr] = monthKey.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);
  if (isNaN(monthIdx) || isNaN(year) || monthIdx < 0 || monthIdx > 11) {
    return monthKey;
  }
  return `${MONTH_NAMES[monthIdx]}/${year}`;
}

/**
 * Avança ou retrocede meses a partir de uma chave "YYYY-MM"
 * delta = +1 (próximo mês), delta = -1 (mês anterior)
 */
export function addMonths(monthKey: string, delta: number): string {
  const [yearStr, monthStr] = monthKey.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10); // 1-12

  month += delta;
  while (month > 12) {
    month -= 12;
    year += 1;
  }
  while (month < 1) {
    month += 12;
    year -= 1;
  }

  const paddedMonth = month.toString().padStart(2, '0');
  return `${year}-${paddedMonth}`;
}

/**
 * Retorna a diferença de meses entre dois "YYYY-MM" (monthB - monthA)
 */
export function diffInMonths(monthA: string, monthB: string): number {
  const [yA, mA] = monthA.split('-').map(Number);
  const [yB, mB] = monthB.split('-').map(Number);
  return (yB - yA) * 12 + (mB - mA);
}

/**
 * Formata moeda BRL
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Gera uma lista de próximos N meses a partir de um mês base
 */
export function generateFutureMonthsList(baseMonth: string, count: number = 12): string[] {
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    list.push(addMonths(baseMonth, i));
  }
  return list;
}
