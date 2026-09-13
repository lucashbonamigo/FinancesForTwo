import React from 'react';
import { CoupleData, UpcomingBill, Transaction, Goal } from '../types/finance';
import { formatMonthLabel } from '../data/dateUtils';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  couple: CoupleData;
  selectedMonth: string;
  upcomingBills: UpcomingBill[];
  transactions: Transaction[];
  goals: Goal[];
  onToggleBillPaid: (billId: string) => void;
  onNavigateTab: (tab: 'dashboard' | 'transactions' | 'goals' | 'forecasts') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  couple,
  selectedMonth,
  upcomingBills,
  transactions,
  goals,
  onToggleBillPaid,
  onNavigateTab,
}) => {
  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0);

  const urgentBills = upcomingBills.filter((b) => !b.isPaid && b.daysUntilDue <= 7);


  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero: Saldo Conjunto e Saldos Individuais */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-brand-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 rounded-full bg-teal-400/10 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
                Orçamento Consolidado do Casal
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1 text-white">
                {formatBRL(couple.jointBalance)}
              </h1>
            </div>
            <button
              onClick={() => onNavigateTab('forecasts')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-emerald-100 transition-all cursor-pointer"
              title="Clique para ver previsões deste mês"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatMonthLabel(selectedMonth)}</span>
            </button>
          </div>

          {/* Individual Balances Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/15">
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

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-black/15 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                Receitas do Mês
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-100 mt-1">
                + {formatBRL(totalIncome)}
              </div>
            </div>
            <div className="bg-black/15 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                Despesas Totais
              </div>
              <div className="text-sm sm:text-base font-bold text-rose-100 mt-1">
                - {formatBRL(totalExpenses)}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-black/15 p-3 rounded-xl flex sm:flex-col justify-between items-center sm:items-start">
              <div className="flex items-center gap-1.5 text-xs text-teal-200 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Saldo Operacional
              </div>
              <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                {formatBRL(totalIncome - totalExpenses)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de Acesso Rápido a Previsões & Dívidas */}
      <div className="bg-gradient-to-r from-teal-900 to-brand-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Planejamento & Dívidas Parceladas de {formatMonthLabel(selectedMonth)}
            </h3>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Acompanhe a previsão de entradas futuras de {couple.partner1.name} e {couple.partner2.name} e parcelas ativas.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('forecasts')}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 self-stretch sm:self-auto justify-center"
        >
          <span>Abrir Previsões</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid: Alertas de Contas Fixas & Metas Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contas Recorrentes Próximas ao Vencimento (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Contas Próximas ao Vencimento</h2>
                <p className="text-xs text-slate-500">Alertas de IPTU, IPVA, Manutenções e planos recorrentes</p>
              </div>
            </div>
            {urgentBills.length > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                {urgentBills.length} urgente{urgentBills.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {upcomingBills.map((bill) => {
              const isUrgent = bill.daysUntilDue <= 3 && !bill.isPaid;
              return (
                <div
                  key={bill.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    bill.isPaid
                      ? 'bg-slate-50/70 border-slate-200 opacity-70'
                      : isUrgent
                      ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleBillPaid(bill.id)}
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
                      <p
                        className={`text-sm font-semibold ${
                          bill.isPaid ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {bill.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{bill.category}</span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                          {bill.responsible === 'CONJUNTO' ? 'Casal (50/50)' : bill.responsible}
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
                        bill.isPaid
                          ? 'text-emerald-600'
                          : isUrgent
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {bill.isPaid ? 'Pago ✓' : `Em ${bill.daysUntilDue} dias`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metas em Destaque (5 colunas) */}
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
              {goals.slice(0, 2).map((goal) => {
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
