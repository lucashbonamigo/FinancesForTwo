export type Category =
  | 'IPTU'
  | 'IPVA'
  | 'Manutenção (Carro/Moto)'
  | 'Cursos'
  | 'Esportes'
  | 'Lazer'
  | 'Compras'
  | 'Presentes';

export type GoalCategory = 'Casamento' | 'Investimentos';
export type Partner = 'LUCAS' | 'STEFANI' | 'CONJUNTO';

export interface PartnerProfile {
  id: string;
  name: string;
  avatarColor: string;
  currentBalance: number;
}

export interface CoupleData {
  partner1: PartnerProfile;
  partner2: PartnerProfile;
  jointBalance: number;
  monthReference: string; // e.g. "2026-10"
}

export interface UpcomingBill {
  id: string;
  title: string;
  category: Category;
  amount: number;
  dueDate: string;
  month: string; // "2026-10"
  daysUntilDue: number;
  responsible: Partner;
  isPaid: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: Category;
  type: 'EXPENSE' | 'INCOME';
  paidBy: Partner;
  date: string; // "DD/MM/YYYY"
  month?: string; // "YYYY-MM", e.g. "2026-10"
  notes?: string;
  installmentInfo?: {
    current: number;
    total: number;
    debtId: string;
  };
}

export interface GoalContribution {
  id: string;
  contributor: Partner;
  amount: number;
  date: string;
}

export type DebitResponsible = 'LUCAS' | 'STEFANI' | 'AMBOS';

export interface GoalMonthlyDebitConfig {
  monthlyAmount: number; // Valor a ser descontado mensalmente
  responsible: DebitResponsible; // Pessoa A, Pessoa B ou Ambos
  lucasAmount?: number; // quanto de Lucas se Ambos
  stefaniAmount?: number; // quanto de Stefani se Ambos
  isAutomatic: boolean; // true = Automático mensal, false = Apenas manual
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  contributions: GoalContribution[];
  debitConfig?: GoalMonthlyDebitConfig;
}

// Registro explícito de Entrada Financeira (Aba "Entradas")
export interface IncomeItem {
  id: string;
  description: string;
  amount: number;
  date: string; // "DD/MM/AAAA"
  month: string; // "YYYY-MM"
  recipient: Partner; // LUCAS, STEFANI, CONJUNTO
  category?: Category;
  notes?: string;
  isReceived?: boolean;
}

// Item do gráfico de linha do tempo financeira
export interface FinancialTimelineMonth {
  month: string;
  fullMonth: string;
  isProjected: boolean;
  entradas: number;
  gastos: number;
  saldoLiquido: number;
  saldoAcumulado: number;
}

// Previsão de entrada futura (ex: entrada de X do Lucas e Y da Stefani para o próximo mês)
export interface FutureIncomeForecast {
  id: string;
  title: string;
  amount: number;
  recipient: Partner; // LUCAS, STEFANI, CONJUNTO
  month: string; // "YYYY-MM" e.g. "2026-11"
  category: Category;
  notes?: string;
  isReceived?: boolean;
}

// Registro de dívida / contas com parcelas (ex: 22.000 em 36x)
export interface DebtPlan {
  id: string;
  title: string;
  totalAmount: number;
  totalInstallments: number; // ex: 36
  installmentAmount: number; // ex: 22000 / 36 = 611.11
  paidInstallments: number; // ex: 1
  startMonth: string; // "YYYY-MM" e.g. "2026-10"
  category: Category;
  responsible: Partner;
  notes?: string;
}

