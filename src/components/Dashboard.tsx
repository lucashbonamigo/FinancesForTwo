import React, { useState } from 'react';
import {
  CoupleData,
  UpcomingBill,
  DebtPlan,
  Goal,
  IncomeItem,
  Transaction,
} from '../types/finance';
import { formatMonthLabel, diffInMonths, addMonths } from '../data/dateUtils';
import { financialTimelineData } from '../data/mockFinanceData';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  LineChart as LineChartIcon,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Equal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface DashboardProps {
  couple: CoupleData;
  selectedMonth: string;
  upcomingBills: UpcomingBill[];
  debtPlans: DebtPlan[];
  incomes: IncomeItem[];
  transactions?: Transaction[];
  goals: Goal[];
  onToggleBillPaid?: (billId: string) => void;
  onPayDebtInstallment?: (debtId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'incomes' | 'goals' | 'debts') => void;
  onSelectMonth: (month: string) => void;
  timelineData?: import('../types/finance').FinancialTimelineMonth[];
  partner1Name?: string;
  partner2Name?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  couple,
  selectedMonth,
  upcomingBills,
  debtPlans,
  incomes,
  transactions = [],
  goals,
  onToggleBillPaid,
  onPayDebtInstallment,
  onNavigateTab,
  onSelectMonth,
  timelineData = financialTimelineData,
  partner1Name = couple.partner1.name,
  partner2Name = couple.partner2.name,
}) => {
  const [chartType, setChartType] = useState<'bars' | 'area'>('bars');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // 1. Entradas do mês selecionado
  const monthIncomes = incomes.filter((inc) => inc.month === selectedMonth);
  const totalMonthIncomes = monthIncomes.reduce((acc, inc) => acc + inc.amount, 0);

  // 2. Despesas variáveis do mês selecionado
  const monthExpenses = transactions
    .filter((t) => t.type === 'EXPENSE' && (!t.month || t.month === selectedMonth))
    .reduce((acc, t) => acc + t.amount, 0);

  // 3. Contas fixas do mês selecionado
  const monthBills = upcomingBills.filter(
    (b) => !b.month || b.month === selectedMonth
  );
  const totalMonthBills = monthBills.reduce((acc, b) => acc + b.amount, 0);

  // 4. Parcelas ativas de Dívidas no mês selecionado (Reflexo de "Contas e Dívidas")
  interface ActiveDebtItem {
    debt: DebtPlan;
    installmentNumber: number;
    amount: number;
    isPaid: boolean;
  }

  const activeDebtItems: ActiveDebtItem[] = debtPlans
    .map((debt) => {
      const monthOffset = diffInMonths(debt.startMonth, selectedMonth);
      if (monthOffset >= 0 && monthOffset < debt.totalInstallments) {
        const currentInstallmentNum = monthOffset + 1;
        const isPaid = currentInstallmentNum <= debt.paidInstallments;
        return {
          debt,
          installmentNumber: currentInstallmentNum,
          amount: debt.installmentAmount,
          isPaid,
        };
      }
      return null;
    })
    .filter((item): item is ActiveDebtItem => item !== null);

  const totalDebtInstallments = activeDebtItems.reduce((acc, d) => acc + d.amount, 0);

  // 5. Total de Saídas (Despesas + Contas Fixas + Parcelas de Dívidas)
  const totalMonthOutflows = monthExpenses + totalMonthBills + totalDebtInstallments;

  // 6. Resumo do status atual do Mês: Saldo - Saída com o valor
  const netMonthlyResult = totalMonthIncomes - totalMonthOutflows;

  // 7. Lista unificada de Contas Próximas ao Vencimento (Reflexo fiel de Contas e Dívidas)
  // Une contas fixas e parcelas das dívidas deste mês
  interface UnifiedPendingBill {
    id: string;
    title: string;
    category: string;
    amount: number;
    dueDate: string;
    responsible: string;
    isPaid: boolean;
    isDebtInstallment: boolean;
    debtId?: string;
    badgeText?: string;
  }

  const unifiedBills: UnifiedPendingBill[] = [
    // Parcelas ativas de dívidas
    ...activeDebtItems.map((item) => ({
      id: `debt_${item.debt.id}_${item.installmentNumber}`,
      title: `${item.debt.title} (Parcela ${item.installmentNumber}/${item.debt.totalInstallments})`,
      category: item.debt.category,
      amount: item.amount,
      dueDate: `10/${selectedMonth.split('-')[1]}/${selectedMonth.split('-')[0]}`,
      responsible: item.debt.responsible === 'CONJUNTO' ? 'Casal (50/50)' : item.debt.responsible,
      isPaid: item.isPaid,
      isDebtInstallment: true,
      debtId: item.debt.id,
      badgeText: `Dívida ${item.installmentNumber}x/${item.debt.totalInstallments}x`,
    })),
    // Contas recorrentes/fixas
    ...monthBills.map((b) => ({
      id: b.id,
      title: b.title,
      category: b.category,
      amount: b.amount,
      dueDate: b.dueDate,
      responsible: b.responsible === 'CONJUNTO' ? 'Casal (50/50)' : b.responsible,
      isPaid: b.isPaid,
      isDebtInstallment: false,
      badgeText: 'Conta Fixa',
    })),
  ];

  const pendingBillsCount = unifiedBills.filter((b) => !b.isPaid).length;

  // Custom Recharts Tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-700">
            <span className="font-extrabold text-emerald-300">{label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                data.isProjected
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              }`}
            >
              {data.isProjected ? 'Projeção Futura' : 'Histórico Realizado'}
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">Entradas / Receitas:</span>
              <span className="font-bold text-emerald-400">+{formatBRL(data.entradas)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-300">Gastos / Saídas Totais:</span>
              <span className="font-bold text-rose-400">-{formatBRL(data.gastos)}</span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
              <span className="text-slate-200 font-semibold">Resultado do Mês:</span>
              <span
                className={`font-black ${
                  data.saldoLiquido >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatBRL(data.saldoLiquido)}
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-medium">Saldo Acumulado:</span>
              <span className="font-extrabold text-blue-300">{formatBRL(data.saldoAcumulado)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. SEÇÃO: ORÇAMENTO CONSOLIDADO DO CASAL */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-brand-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 rounded-full bg-teal-400/10 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
                Orçamento Consolidado do Casal
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1 text-white">
                {formatBRL(couple.jointBalance)}
              </h1>
            </div>

            <button
              onClick={() => onNavigateTab('debts')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-emerald-100 transition-all cursor-pointer"
              title="Competência atual"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatMonthLabel(selectedMonth)}</span>
            </button>
          </div>

          {/* Saldos Individuais: Lucas & Stefani */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/15">
            {/* Lucas */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: couple.partner1.avatarColor }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs ring-2 ring-white/30"
                >
                  {couple.partner1.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-200">Saldo Individual</p>
                  <p className="font-bold text-lg text-white">{couple.partner1.name}</p>
                </div>
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-white">
                {formatBRL(couple.partner1.currentBalance)}
              </span>
            </div>

            {/* Stefani */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: couple.partner2.avatarColor }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs ring-2 ring-white/30"
                >
                  {couple.partner2.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-200">Saldo Individual</p>
                  <p className="font-bold text-lg text-white">{couple.partner2.name}</p>
                </div>
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-white">
                {formatBRL(couple.partner2.currentBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RESUMO DO STATUS ATUAL DO MÊS: SALDO - SAÍDA COM O VALOR */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Fluxo Financeiro do Mês
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Balanço de {formatMonthLabel(selectedMonth)}
            </h2>
            <p className="text-xs text-slate-500">
              Cálculo exato de Entradas (Receitas) menos Saídas Totais (Despesas, Parcelas e Contas)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('incomes')}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all"
            >
              + Ver Entradas
            </button>
            <button
              onClick={() => onNavigateTab('debts')}
              className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all"
            >
              Ver Dívidas
            </button>
          </div>
        </div>

        {/* Card Matemático de Saldo - Saída = Resultado */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-stretch pt-2">
          {/* Entradas */}
          <div className="md:col-span-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-bold uppercase tracking-wider">Entradas do Mês</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-black text-emerald-900">
                +{formatBRL(totalMonthIncomes)}
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                {monthIncomes.length} receita(s) registrada(s)
              </p>
            </div>
          </div>

          {/* Operador de Menos */}
          <div className="md:col-span-1 hidden md:flex items-center justify-center text-slate-400 font-black text-2xl">
            -
          </div>

          {/* Saídas */}
          <div className="md:col-span-3 bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-800">
              <span className="text-xs font-bold uppercase tracking-wider">Saídas & Compromissos</span>
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-black text-rose-900">
                -{formatBRL(totalMonthOutflows)}
              </p>
              <p className="text-[11px] text-rose-700 mt-1">
                Contas ({formatBRL(totalMonthBills)}) + Dívidas ({formatBRL(totalDebtInstallments)})
              </p>
            </div>
          </div>

          {/* Operador de Igual */}
          <div className="md:col-span-1 hidden md:flex items-center justify-center text-slate-400 font-black text-2xl">
            =
          </div>

          {/* Saldo Líquido do Mês */}
          <div
            className={`md:col-span-3 rounded-2xl p-4 flex flex-col justify-between border shadow-xs ${
              netMonthlyResult >= 0
                ? 'bg-gradient-to-br from-brand-900 to-teal-900 text-white border-brand-800'
                : 'bg-gradient-to-br from-rose-900 to-red-950 text-white border-rose-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Saldo Líquido Operacional
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-black">
                {formatBRL(netMonthlyResult)}
              </p>
              <p className="text-[11px] text-emerald-100/80 mt-1">
                {netMonthlyResult >= 0
                  ? 'Superávit disponível para metas e investimentos'
                  : 'Atenção: saída maior que entrada no período'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NOVO DASHBOARD DE GRÁFICOS: HISTÓRICO DE MESES PASSADOS & PROJEÇÃO DE MESES FUTUROS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                Evolução Financeira: Histórico & Projeções Futuras
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Acompanhe os meses passados consolidados e a projeção de receitas vs gastos para os próximos meses.
            </p>
          </div>

          {/* Alternador de tipo de gráfico */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setChartType('bars')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartType === 'bars'
                  ? 'bg-white text-brand-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Comparativo Mensal
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartType === 'area'
                  ? 'bg-white text-brand-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              Saldo Acumulado
            </button>
          </div>
        </div>

        {/* Legenda Explicativa de Histórico vs Projeção */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
              <span className="font-semibold text-slate-700">Entradas / Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
              <span className="font-semibold text-slate-700">Gastos / Saídas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" />
              <span className="font-semibold text-slate-700">Saldo Acumulado</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
              Jun — Set: Histórico
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
              Nov — Fev: Projeção Futura
            </span>
          </div>
        </div>

        {/* Gráfico Interativo com Recharts */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bars' ? (
              <BarChart
                data={financialTimelineData}
                margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                />
                <Bar
                  dataKey="entradas"
                  name="Entradas"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="gastos"
                  name="Gastos Totais"
                  fill="#E11D48"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            ) : (
              <AreaChart
                data={financialTimelineData}
                margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="saldoLiquido"
                  name="Saldo Líquido Mensal"
                  stroke="#0D9488"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSaldo)"
                />
                <Area
                  type="monotone"
                  dataKey="saldoAcumulado"
                  name="Reserva Acumulada do Casal"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorAcumulado)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. GRID: CONTAS PRÓXIMAS AO VENCIMENTO & METAS EM ANDAMENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contas Próximas ao Vencimento - REFLEXO EXATO DE CONTAS E DÍVIDAS (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Contas Próximas ao Vencimento</h2>
                <p className="text-xs text-slate-500">
                  Reflexo automático das parcelas de dívidas e contas cadastradas na aba "Contas e Dívidas"
                </p>
              </div>
            </div>
            {pendingBillsCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                {pendingBillsCount} a vencer
              </span>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {unifiedBills.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhuma conta ou parcela prevista para {formatMonthLabel(selectedMonth)}.
              </div>
            ) : (
              unifiedBills.map((bill) => (
                <div
                  key={bill.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    bill.isPaid
                      ? 'bg-slate-50/70 border-slate-200 opacity-70'
                      : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (bill.isDebtInstallment && bill.debtId) {
                          onPayDebtInstallment?.(bill.debtId);
                        } else {
                          onToggleBillPaid?.(bill.id);
                        }
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        bill.isPaid
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 hover:border-emerald-500 text-transparent'
                      }`}
                      title={bill.isPaid ? 'Marcar como não pago' : 'Marcar como pago'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            bill.isPaid ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {bill.title}
                        </p>
                        {bill.badgeText && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              bill.isDebtInstallment
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {bill.badgeText}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{bill.category}</span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                          {bill.responsible}
                        </span>
                        <span>•</span>
                        <span>Vence: {bill.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-extrabold ${
                        bill.isPaid ? 'text-slate-400' : 'text-rose-600'
                      }`}
                    >
                      {formatBRL(bill.amount)}
                    </p>
                    <span
                      className={`text-[11px] font-bold inline-block mt-0.5 ${
                        bill.isPaid ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {bill.isPaid ? 'Pago ✓' : 'A pagar'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Metas em Andamento (5 colunas) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Metas em Andamento</h2>
                <p className="text-xs text-slate-500">Poupança para objetivos conjuntos</p>
              </div>
              <button
                onClick={() => onNavigateTab('goals')}
                className="text-xs font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1"
              >
                Ver todas <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {goals.slice(0, 3).map((goal) => {
                const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                const isWedding = goal.category === 'Casamento';

                return (
                  <div key={goal.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          isWedding ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isWedding ? '💍 Casamento' : '📈 Investimentos'}
                      </span>
                      <span className="text-xs font-extrabold text-slate-800">{pct}%</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{goal.title}</h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden my-2.5">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWedding ? 'bg-pink-600' : 'bg-brand-800'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700">{formatBRL(goal.currentAmount)}</span>
                      <span className="text-slate-500">Meta: {formatBRL(goal.targetAmount)}</span>
                    </div>

                    {goal.debitConfig && (
                      <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                        <span className="font-bold text-brand-800">
                          {goal.debitConfig.isAutomatic ? 'Aporte Automático:' : 'Aporte Manual:'}
                        </span>
                        <span>{formatBRL(goal.debitConfig.monthlyAmount)}/mês</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('goals')}
            className="w-full mt-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors text-center"
          >
            Aportar ou Criar Nova Meta
          </button>
        </div>
      </div>
    </div>
  );
};
