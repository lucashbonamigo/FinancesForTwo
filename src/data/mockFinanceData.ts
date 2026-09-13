import {
  CoupleData,
  UpcomingBill,
  Transaction,
  Goal,
  Category,
  FutureIncomeForecast,
  DebtPlan,
  IncomeItem,
} from '../types/finance';

export const CATEGORIES_LIST: Category[] = [
  'IPTU',
  'IPVA',
  'Manutenção (Carro/Moto)',
  'Cursos',
  'Esportes',
  'Lazer',
  'Compras',
  'Presentes',
];

export const initialCoupleData: CoupleData = {
  partner1: {
    id: 'usr_lucas',
    name: 'Lucas',
    avatarColor: '#1976D2',
    currentBalance: 4850.00,
  },
  partner2: {
    id: 'usr_stefani',
    name: 'Stefani',
    avatarColor: '#D81B60',
    currentBalance: 5420.00,
  },
  jointBalance: 10270.00,
  monthReference: '2026-10', // Outubro/2026
};

// Contas e Dívidas ativas
export const initialUpcomingBills: UpcomingBill[] = [
  {
    id: 'bill_01',
    title: 'IPTU Residencial (Parcela 03/10)',
    category: 'IPTU',
    amount: 385.50,
    dueDate: '15/10/2026',
    month: '2026-10',
    daysUntilDue: 3,
    responsible: 'CONJUNTO',
    isPaid: false,
  },
  {
    id: 'bill_02',
    title: 'IPVA Honda Civic (Parcela 04/05)',
    category: 'IPVA',
    amount: 612.00,
    dueDate: '19/10/2026',
    month: '2026-10',
    daysUntilDue: 7,
    responsible: 'LUCAS',
    isPaid: false,
  },
  {
    id: 'bill_03',
    title: 'Revisão e Manutenção Geral (Moto)',
    category: 'Manutenção (Carro/Moto)',
    amount: 850.00,
    dueDate: '24/10/2026',
    month: '2026-10',
    daysUntilDue: 12,
    responsible: 'CONJUNTO',
    isPaid: false,
  },
  {
    id: 'bill_04',
    title: 'Plano de Academia Casal',
    category: 'Esportes',
    amount: 260.00,
    dueDate: '28/10/2026',
    month: '2026-10',
    daysUntilDue: 16,
    responsible: 'STEFANI',
    isPaid: true,
  },
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx_101',
    title: 'Jantar Romântico Aniversário',
    amount: 320.00,
    category: 'Lazer',
    type: 'EXPENSE',
    paidBy: 'LUCAS',
    date: '08/10/2026',
    month: '2026-10',
    notes: 'Restaurante italiano',
  },
  {
    id: 'tx_102',
    title: 'Presente de Casamento Padrinhos',
    amount: 450.00,
    category: 'Presentes',
    type: 'EXPENSE',
    paidBy: 'STEFANI',
    date: '07/10/2026',
    month: '2026-10',
    notes: 'Caixas personalizadas com espumante',
  },
  {
    id: 'tx_103',
    title: 'Curso de Conversação em Inglês',
    amount: 490.00,
    category: 'Cursos',
    type: 'EXPENSE',
    paidBy: 'CONJUNTO',
    date: '05/10/2026',
    month: '2026-10',
    notes: 'Preparação para viagem',
  },
  {
    id: 'tx_104',
    title: 'Pastilhas de Freio e Troca de Óleo',
    amount: 380.00,
    category: 'Manutenção (Carro/Moto)',
    type: 'EXPENSE',
    paidBy: 'LUCAS',
    date: '03/10/2026',
    month: '2026-10',
  },
  {
    id: 'tx_105',
    title: 'Itens de Decoração Sala',
    amount: 650.00,
    category: 'Compras',
    type: 'EXPENSE',
    paidBy: 'STEFANI',
    date: '01/10/2026',
    month: '2026-10',
  },
];

// Histórico e Lista de Entradas da nova aba "Entradas"
export const initialIncomes: IncomeItem[] = [
  {
    id: 'inc_01',
    description: 'Salário Mensal CLT - Empresa de Tecnologia',
    amount: 6800.00,
    date: '05/10/2026',
    month: '2026-10',
    recipient: 'LUCAS',
    category: 'Cursos',
    notes: 'Salário líquido já com descontos em folha',
  },
  {
    id: 'inc_02',
    description: 'Salário Mensal & Comissões de Vendas',
    amount: 7200.00,
    date: '05/10/2026',
    month: '2026-10',
    recipient: 'STEFANI',
    category: 'Compras',
    notes: 'Salário fixo + metas trimestrais batidas',
  },
  {
    id: 'inc_03',
    description: 'Consultoria e Aulas Particulares',
    amount: 1400.00,
    date: '08/10/2026',
    month: '2026-10',
    recipient: 'LUCAS',
    category: 'Cursos',
    notes: 'Mentoria para desenvolvedores jr.',
  },
  {
    id: 'inc_04',
    description: 'Rendimento de Dividendos & Fundo Imobiliário',
    amount: 650.00,
    date: '10/10/2026',
    month: '2026-10',
    recipient: 'CONJUNTO',
    category: 'Lazer',
    notes: 'Proventos automáticos reinvestidos',
  },
  {
    id: 'inc_05',
    description: 'Design de Identidade Visual Freelance',
    amount: 1200.00,
    date: '12/10/2026',
    month: '2026-10',
    recipient: 'STEFANI',
    category: 'Presentes',
    notes: 'Projeto de branding para clínica',
  },
  {
    id: 'inc_past_01',
    description: 'Salário Mensal Setembro',
    amount: 6800.00,
    date: '05/09/2026',
    month: '2026-09',
    recipient: 'LUCAS',
  },
  {
    id: 'inc_past_02',
    description: 'Salário Mensal Setembro',
    amount: 7000.00,
    date: '05/09/2026',
    month: '2026-09',
    recipient: 'STEFANI',
  },
  {
    id: 'inc_past_03',
    description: 'Bônus Semestral de Desempenho',
    amount: 3500.00,
    date: '20/09/2026',
    month: '2026-09',
    recipient: 'LUCAS',
  },
];

// Metas do Casal com campos de configuração de aporte
export const initialGoals: Goal[] = [
  {
    id: 'goal_casamento',
    title: 'Festa de Casamento & Recepção dos Sonhos',
    category: 'Casamento',
    targetAmount: 50000.00,
    currentAmount: 32800.00,
    targetDate: 'Dezembro/2026',
    debitConfig: {
      monthlyAmount: 2000.00,
      responsible: 'AMBOS',
      lucasAmount: 1000.00,
      stefaniAmount: 1000.00,
      isAutomatic: true,
    },
    contributions: [
      { id: 'c1', contributor: 'LUCAS', amount: 1200.00, date: '01/10/2026' },
      { id: 'c2', contributor: 'STEFANI', amount: 1500.00, date: '01/10/2026' },
      { id: 'c3', contributor: 'CONJUNTO', amount: 2000.00, date: '15/09/2026' },
    ],
  },
  {
    id: 'goal_investimentos',
    title: 'Carteira de Investimentos de Longo Prazo (CDI/Ações)',
    category: 'Investimentos',
    targetAmount: 100000.00,
    currentAmount: 45600.00,
    targetDate: 'Dezembro/2027',
    debitConfig: {
      monthlyAmount: 1600.00,
      responsible: 'AMBOS',
      lucasAmount: 800.00,
      stefaniAmount: 800.00,
      isAutomatic: true,
    },
    contributions: [
      { id: 'c4', contributor: 'LUCAS', amount: 800.00, date: '02/10/2026' },
      { id: 'c5', contributor: 'STEFANI', amount: 800.00, date: '02/10/2026' },
    ],
  },
  {
    id: 'goal_lua_de_mel',
    title: 'Lua de Mel na Costa Amalfitana',
    category: 'Casamento',
    targetAmount: 22000.00,
    currentAmount: 16400.00,
    targetDate: 'Janeiro/2027',
    debitConfig: {
      monthlyAmount: 1500.00,
      responsible: 'AMBOS',
      lucasAmount: 750.00,
      stefaniAmount: 750.00,
      isAutomatic: false, // apenas manual
    },
    contributions: [
      { id: 'c6', contributor: 'CONJUNTO', amount: 1500.00, date: '20/09/2026' },
    ],
  },
];

// Previsões de Entradas Futuras (mantido para projeções)
export const initialFutureIncomes: FutureIncomeForecast[] = [
  {
    id: 'inc_nov_01',
    title: 'Previsão Salário & Consultoria Lucas',
    amount: 5500.00,
    recipient: 'LUCAS',
    month: '2026-11',
    category: 'Cursos',
    notes: 'Salário base + consultorias extras de tecnologia',
    isReceived: false,
  },
  {
    id: 'inc_nov_02',
    title: 'Previsão Salário & Comissões Stefani',
    amount: 6200.00,
    recipient: 'STEFANI',
    month: '2026-11',
    category: 'Compras',
    notes: 'Salário fixo + metas de vendas atingidas',
    isReceived: false,
  },
  {
    id: 'inc_nov_03',
    title: 'Rendimento de Aplicações Conjuntas',
    amount: 850.00,
    recipient: 'CONJUNTO',
    month: '2026-11',
    category: 'Lazer',
    notes: 'Dividendos e juros do fundo de reserva',
    isReceived: false,
  },
  {
    id: 'inc_dez_01',
    title: '13º Salário + Bônus Lucas',
    amount: 6000.00,
    recipient: 'LUCAS',
    month: '2026-12',
    category: 'Cursos',
    notes: 'Segunda parcela do 13º e PLR da empresa',
    isReceived: false,
  },
  {
    id: 'inc_dez_02',
    title: '13º Salário Stefani',
    amount: 6200.00,
    recipient: 'STEFANI',
    month: '2026-12',
    category: 'Presentes',
    notes: 'Segunda parcela do 13º salário',
    isReceived: false,
  },
];

// Registro de Dívidas & Contas Parceladas (ex: 22.000 em 36x e 7.200 em 12x)
export const initialDebtPlans: DebtPlan[] = [
  {
    id: 'debt_01',
    title: 'Financiamento Veículo Familiar / Conta Parcelada',
    totalAmount: 22000.00,
    totalInstallments: 36,
    installmentAmount: 611.11,
    paidInstallments: 1,
    startMonth: '2026-10',
    category: 'Manutenção (Carro/Moto)',
    responsible: 'CONJUNTO',
    notes: 'Contrato de parcelamento em 36 vezes fixas de R$ 611,11',
  },
  {
    id: 'debt_02',
    title: 'Móveis Planejados Cozinha & Sala',
    totalAmount: 7200.00,
    totalInstallments: 12,
    installmentAmount: 600.00,
    paidInstallments: 4,
    startMonth: '2026-07',
    category: 'Compras',
    responsible: 'CONJUNTO',
    notes: 'Marcenaria sob medida parcelada sem juros',
  },
];

// Dados consolidados para o Dashboard de Gráficos (Histórico passado + Projeção futura)
export interface MonthChartDataPoint {
  month: string; // ex: "Jul/26"
  fullMonth: string; // "2026-07"
  isProjected: boolean;
  entradas: number; // receitas
  gastos: number; // despesas + parcelas + contas
  saldoLiquido: number; // entradas - gastos
  saldoAcumulado: number; // saldo acumulado do casal
}

export const financialTimelineData: MonthChartDataPoint[] = [
  {
    month: 'Jun/26',
    fullMonth: '2026-06',
    isProjected: false,
    entradas: 13500,
    gastos: 8900,
    saldoLiquido: 4600,
    saldoAcumulado: 7200,
  },
  {
    month: 'Jul/26',
    fullMonth: '2026-07',
    isProjected: false,
    entradas: 14200,
    gastos: 10400,
    saldoLiquido: 3800,
    saldoAcumulado: 8100,
  },
  {
    month: 'Ago/26',
    fullMonth: '2026-08',
    isProjected: false,
    entradas: 13900,
    gastos: 9800,
    saldoLiquido: 4100,
    saldoAcumulado: 9350,
  },
  {
    month: 'Set/26',
    fullMonth: '2026-09',
    isProjected: false,
    entradas: 17300,
    gastos: 11200,
    saldoLiquido: 6100,
    saldoAcumulado: 10270,
  },
  {
    month: 'Out/26 (Atual)',
    fullMonth: '2026-10',
    isProjected: false,
    entradas: 16250,
    gastos: 10850,
    saldoLiquido: 5400,
    saldoAcumulado: 12150,
  },
  {
    month: 'Nov/26 (Proj.)',
    fullMonth: '2026-11',
    isProjected: true,
    entradas: 12550,
    gastos: 7800,
    saldoLiquido: 4750,
    saldoAcumulado: 14800,
  },
  {
    month: 'Dez/26 (Proj.)',
    fullMonth: '2026-12',
    isProjected: true,
    entradas: 24400,
    gastos: 11500,
    saldoLiquido: 12900,
    saldoAcumulado: 21500,
  },
  {
    month: 'Jan/27 (Proj.)',
    fullMonth: '2027-01',
    isProjected: true,
    entradas: 13800,
    gastos: 9200,
    saldoLiquido: 4600,
    saldoAcumulado: 24200,
  },
  {
    month: 'Fev/27 (Proj.)',
    fullMonth: '2027-02',
    isProjected: true,
    entradas: 13500,
    gastos: 8900,
    saldoLiquido: 4600,
    saldoAcumulado: 26800,
  },
];

