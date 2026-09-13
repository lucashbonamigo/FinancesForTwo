import React from 'react';
import { CoupleData } from '../types/finance';
import {
  LayoutDashboard,
  ArrowUpRight,
  Target,
  CreditCard,
  PlusCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { formatMonthLabel, addMonths } from '../data/dateUtils';

export type ActiveTabType = 'dashboard' | 'incomes' | 'goals' | 'debts';

interface NavbarProps {
  couple: CoupleData;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  onOpenNewIncome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  couple,
  activeTab,
  setActiveTab,
  selectedMonth,
  onSelectMonth,
  onOpenNewIncome,
}) => {
  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-800 to-emerald-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <Heart className="w-5 h-5 fill-white/80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                  Finanças a Dois
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hidden xs:inline-block">
                  Casal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {couple.partner1.name} & {couple.partner2.name}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) - As 4 abas solicitadas */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-brand-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Visão Geral
            </button>

            <button
              onClick={() => setActiveTab('incomes')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'incomes'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Entradas
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'goals'
                  ? 'bg-white text-brand-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Metas do Casal
            </button>

            <button
              onClick={() => setActiveTab('debts')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'debts'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Contas e Dívidas
            </button>
          </nav>

          {/* Month Selector in Navbar & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Seletor Rápido de Mês */}
            <div className="flex items-center bg-slate-100/90 border border-slate-200/80 rounded-2xl p-1 gap-1">
              <button
                onClick={() => onSelectMonth(addMonths(selectedMonth, -1))}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                title="Mês Anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div
                onClick={() => setActiveTab('debts')}
                className="flex items-center gap-1 px-1.5 py-0.5 cursor-pointer text-xs font-bold text-slate-800 hover:text-brand-900"
                title="Clique para ver Contas e Dívidas deste mês"
              >
                <Calendar className="w-3 h-3 text-brand-800 shrink-0" />
                <span className="whitespace-nowrap">{formatMonthLabel(selectedMonth)}</span>
              </div>
              <button
                onClick={() => onSelectMonth(addMonths(selectedMonth, 1))}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                title="Próximo Mês"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Saldos Casal Avatares */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-2 py-1 gap-1.5 hidden sm:flex">
              <div className="flex -space-x-2 overflow-hidden">
                <div
                  style={{ backgroundColor: couple.partner1.avatarColor }}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[11px] font-bold ring-2 ring-white"
                  title={`${couple.partner1.name}: ${formatBRL(couple.partner1.currentBalance)}`}
                >
                  {couple.partner1.name[0]}
                </div>
                <div
                  style={{ backgroundColor: couple.partner2.avatarColor }}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[11px] font-bold ring-2 ring-white"
                  title={`${couple.partner2.name}: ${formatBRL(couple.partner2.currentBalance)}`}
                >
                  {couple.partner2.name[0]}
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 hidden xl:inline">
                {formatBRL(couple.jointBalance)}
              </span>
            </div>

            {/* Botão Rápido "+ Entrada" */}
            <button
              onClick={onOpenNewIncome}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">+ Entrada</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar (4 Abas) */}
        <div className="grid grid-cols-4 lg:hidden border-t border-slate-100 py-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] sm:text-[11px] font-semibold ${
              activeTab === 'dashboard' ? 'text-brand-800 font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Visão Geral</span>
          </button>
          <button
            onClick={() => setActiveTab('incomes')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] sm:text-[11px] font-semibold ${
              activeTab === 'incomes' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Entradas</span>
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] sm:text-[11px] font-semibold ${
              activeTab === 'goals' ? 'text-brand-800 font-bold' : 'text-slate-500'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Metas</span>
          </button>
          <button
            onClick={() => setActiveTab('debts')}
            className={`flex flex-col items-center gap-1 py-1 px-1 rounded-lg text-[10px] sm:text-[11px] font-semibold ${
              activeTab === 'debts' ? 'text-rose-700 font-bold' : 'text-slate-500'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Contas/Dívidas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
