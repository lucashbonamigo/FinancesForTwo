import React, { useState } from 'react';
import { Goal, GoalCategory, Partner, DebitResponsible, GoalMonthlyDebitConfig } from '../types/finance';
import {
  Target,
  Sparkles,
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Heart,
  X,
  CheckCircle2,
  Repeat,
  HandCoins,
  Settings2,
} from 'lucide-react';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'contributions'> & { initialContribution?: number; contributor?: Partner }) => void;
  onDeleteGoal: (goalId: string) => void;
  onAddContribution: (goalId: string, amount: number, contributor: Partner) => void;
  partner1Name: string;
  partner2Name: string;
}

export const Goals: React.FC<GoalsProps> = ({
  goals,
  onAddGoal,
  onDeleteGoal,
  onAddContribution,
  partner1Name,
  partner2Name,
}) => {
  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<Goal | null>(null);

  // Filtros
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'TODAS'>('TODAS');

  // Formulário de Nova Meta
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('Casamento');
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [newInitialAmount, setNewInitialAmount] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('Dezembro/2026');

  // Configurações de Aporte Mensal
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [responsible, setResponsible] = useState<DebitResponsible>('AMBOS');
  const [lucasAmount, setLucasAmount] = useState('');
  const [stefaniAmount, setStefaniAmount] = useState('');
  const [isAutomatic, setIsAutomatic] = useState(true);

  // Formulário de Depósito Manual
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributor, setContributor] = useState<Partner>('CONJUNTO');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalAccumulated = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalAccumulated / totalTarget) * 100) : 0;

  const filteredGoals = goals.filter((g) =>
    filterCategory === 'TODAS' ? true : g.category === filterCategory
  );

  // Auto-ajuste de divisão 50/50 se ambos
  const handleMonthlyAmountChange = (val: string) => {
    setMonthlyAmount(val);
    const num = parseFloat(val.replace(',', '.'));
    if (!isNaN(num) && num > 0) {
      const half = (num / 2).toFixed(2);
      setLucasAmount(half);
      setStefaniAmount(half);
    }
  };

  const handleCreateGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = parseFloat(newTargetAmount.replace(',', '.'));
    const cleanInitial = newInitialAmount ? parseFloat(newInitialAmount.replace(',', '.')) : 0;
    const cleanMonthly = monthlyAmount ? parseFloat(monthlyAmount.replace(',', '.')) : 0;

    if (!newTitle.trim()) {
      alert('Por favor informe o título da meta.');
      return;
    }
    if (isNaN(cleanTarget) || cleanTarget <= 0) {
      alert('Por favor informe um valor objetivo válido.');
      return;
    }

    let debitConfig: GoalMonthlyDebitConfig | undefined = undefined;
    if (cleanMonthly > 0) {
      debitConfig = {
        monthlyAmount: cleanMonthly,
        responsible,
        isAutomatic,
        lucasAmount: responsible === 'AMBOS' ? parseFloat(lucasAmount.replace(',', '.')) || cleanMonthly / 2 : undefined,
        stefaniAmount: responsible === 'AMBOS' ? parseFloat(stefaniAmount.replace(',', '.')) || cleanMonthly / 2 : undefined,
      };
    }

    onAddGoal({
      title: newTitle.trim(),
      category: newCategory,
      targetAmount: cleanTarget,
      currentAmount: cleanInitial,
      targetDate: newTargetDate.trim() || '2027',
      debitConfig,
      initialContribution: cleanInitial > 0 ? cleanInitial : undefined,
      contributor: 'CONJUNTO',
    });

    // Reset Form
    setNewTitle('');
    setNewTargetAmount('');
    setNewInitialAmount('');
    setMonthlyAmount('');
    setLucasAmount('');
    setStefaniAmount('');
    setIsCreateModalOpen(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanVal = parseFloat(contributionAmount.replace(',', '.'));
    if (isNaN(cleanVal) || cleanVal <= 0) {
      alert('Por favor informe um valor válido maior que zero.');
      return;
    }

    if (selectedGoalForDeposit) {
      onAddContribution(selectedGoalForDeposit.id, cleanVal, contributor);
      setSelectedGoalForDeposit(null);
      setContributionAmount('');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Geral de Metas */}
      <div className="bg-gradient-to-r from-emerald-900 via-brand-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
              Planejamento de Longo Prazo do Casal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
              Metas: Casamento & Investimentos
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
              Acompanhamento conjunto de cada conquista planejada para o futuro de {partner1Name} e {partner2Name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs sm:text-sm px-4 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Nova Meta</span>
            </button>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-right hidden sm:block">
              <span className="text-xs font-semibold text-emerald-200">Progresso Geral</span>
              <p className="text-2xl font-extrabold text-white">{overallPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/15">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-emerald-200">Total Acumulado: {formatBRL(totalAccumulated)}</span>
            <span className="text-emerald-100">Objetivo Total: {formatBRL(totalTarget)}</span>
          </div>
          <div className="w-full bg-black/25 h-3 rounded-full overflow-hidden">
            <div
              style={{ width: `${overallPercentage}%` }}
              className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full transition-all duration-700"
            />
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Botão de Criar Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterCategory('TODAS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterCategory === 'TODAS'
                ? 'bg-brand-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Todas as Metas
          </button>
          <button
            onClick={() => setFilterCategory('Casamento')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterCategory === 'Casamento'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Casamento
          </button>
          <button
            onClick={() => setFilterCategory('Investimentos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              filterCategory === 'Investimentos'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Investimentos
          </button>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="sm:hidden w-full py-2.5 bg-brand-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Criar Nova Meta</span>
        </button>
      </div>

      {/* Grid de Metas (Design elogiado pelo usuário mantido) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => {
          const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
          const percentage = Math.round(progress * 100);
          const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
          const isWedding = goal.category === 'Casamento';

          return (
            <div
              key={goal.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isWedding
                          ? 'bg-pink-50 text-pink-700 border border-pink-200'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {isWedding ? '💍 Casamento' : '📈 Investimentos'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Meta: {goal.targetDate}</span>
                    </div>
                  </div>

                  {/* Botão de Deletar Meta */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja realmente excluir a meta "${goal.title}"?`)) {
                        onDeleteGoal(goal.id);
                      }
                    }}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                    title="Excluir meta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-1">
                  {goal.title}
                </h3>

                {/* Card de Progresso */}
                <div className="bg-slate-50 rounded-2xl p-4 my-4 border border-slate-100">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Guardado até o momento
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-slate-900">
                        {formatBRL(goal.currentAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Meta Final
                      </p>
                      <p className="text-sm sm:text-base font-bold text-slate-600">
                        {formatBRL(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden my-2">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full rounded-full transition-all duration-700 ${
                        isWedding
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600'
                          : 'bg-gradient-to-r from-brand-800 to-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className={isWedding ? 'text-pink-600' : 'text-brand-800'}>
                      {percentage}% atingido
                    </span>
                    <span className="text-slate-500">
                      {remaining > 0 ? `Falta ${formatBRL(remaining)}` : 'Meta Concluída! 🎉'}
                    </span>
                  </div>
                </div>

                {/* Configuração de Aporte Mensal (Badge Informativo) */}
                {goal.debitConfig && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 mb-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        {goal.debitConfig.isAutomatic ? (
                          <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <HandCoins className="w-3.5 h-3.5 text-slate-600" />
                        )}
                        {goal.debitConfig.isAutomatic ? 'Aporte Automático Mensal' : 'Aporte Apenas Manual'}
                      </span>
                      <span className="font-extrabold text-emerald-800">
                        {formatBRL(goal.debitConfig.monthlyAmount)}/mês
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-700 mt-1">
                      Responsável:{' '}
                      <strong>
                        {goal.debitConfig.responsible === 'AMBOS'
                          ? `Ambos (${partner1Name}: ${formatBRL(
                              goal.debitConfig.lucasAmount || goal.debitConfig.monthlyAmount / 2
                            )} + ${partner2Name}: ${formatBRL(
                              goal.debitConfig.stefaniAmount || goal.debitConfig.monthlyAmount / 2
                            )})`
                          : goal.debitConfig.responsible === 'LUCAS'
                          ? partner1Name
                          : partner2Name}
                      </strong>
                    </p>
                  </div>
                )}

                {/* Histórico dos últimos aportes */}
                {goal.contributions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Aportes Recentes do Casal
                    </p>
                    <div className="space-y-1.5">
                      {goal.contributions.slice(0, 3).map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50/70"
                        >
                          <span className="font-medium text-slate-700">
                            {c.contributor === 'CONJUNTO'
                              ? 'Casal (50/50)'
                              : c.contributor === 'LUCAS'
                              ? partner1Name
                              : partner2Name}{' '}
                            <span className="text-slate-400 font-normal">({c.date})</span>
                          </span>
                          <span className="font-bold text-emerald-700">+ {formatBRL(c.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedGoalForDeposit(goal)}
                className={`w-full mt-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isWedding ? 'bg-pink-600 hover:bg-pink-700' : 'bg-brand-800 hover:bg-brand-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                Registrar Novo Aporte
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CRIAÇÃO DE NOVA META COM CONFIGURAÇÃO DE APORTE */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Criar Nova Meta do Casal</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoalSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
              {/* Título */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título da Meta *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Reserva para Imprevistos, Entrada da Casa..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-800/40"
                  required
                />
              </div>

              {/* Categoria & Data Alvo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Categoria *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="Casamento">💍 Casamento</option>
                    <option value="Investimentos">📈 Investimentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Previsão / Data Alvo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dezembro/2027"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Valor Alvo & Valor Já Guardado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Valor Objetivo (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="0,00"
                    value={newTargetAmount}
                    onChange={(e) => setNewTargetAmount(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-emerald-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Valor Inicial Já Guardado
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={newInitialAmount}
                    onChange={(e) => setNewInitialAmount(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              {/* SEÇÃO: CONFIGURAÇÃO DE APORTE */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  <Settings2 className="w-4 h-4 text-brand-800" />
                  <span>Configuração de Aporte Mensal</span>
                </div>

                {/* Valor Mensal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Valor a ser descontado mensalmente (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 1000,00"
                    value={monthlyAmount}
                    onChange={(e) => handleMonthlyAmountChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                  />
                </div>

                {/* Responsável pelo Desconto: Pessoa A, Pessoa B ou Ambos */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Responsável pelo desconto
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setResponsible('LUCAS')}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                        responsible === 'LUCAS'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {partner1Name} (Pessoa A)
                    </button>
                    <button
                      type="button"
                      onClick={() => setResponsible('STEFANI')}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                        responsible === 'STEFANI'
                          ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {partner2Name} (Pessoa B)
                    </button>
                    <button
                      type="button"
                      onClick={() => setResponsible('AMBOS')}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                        responsible === 'AMBOS'
                          ? 'bg-brand-800 text-white border-brand-800 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Ambos (Casal)
                    </button>
                  </div>
                </div>

                {/* Se Ambos: Mostra campos de quanto de cada será descontado */}
                {responsible === 'AMBOS' && (
                  <div className="p-3 bg-white rounded-xl border border-brand-800/20 space-y-2">
                    <p className="text-[11px] font-bold text-brand-900">
                      Divisão do aporte entre {partner1Name} e {partner2Name}:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Desconto de {partner1Name} (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={lucasAmount}
                          onChange={(e) => setLucasAmount(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-blue-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Desconto de {partner2Name} (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={stefaniAmount}
                          onChange={(e) => setStefaniAmount(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-pink-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Toggle / Checkbox: Automático mensal vs Apenas manual */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {isAutomatic ? 'Automático mensal' : 'Apenas manual'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {isAutomatic
                        ? 'Descontado todo início de mês no orçamento'
                        : 'Realizado sob demanda quando vocês decidirem'}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutomatic}
                      onChange={(e) => setIsAutomatic(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRAR NOVO APORTE MANUAL */}
      {selectedGoalForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Registrar Aporte</h3>
              <button
                onClick={() => setSelectedGoalForDeposit(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-brand-800 font-bold mt-2">{selectedGoalForDeposit.title}</p>

            <form onSubmit={handleDepositSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Valor do Aporte (R$)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0,00"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-800/40"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quem está aportando?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContributor('CONJUNTO')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      contributor === 'CONJUNTO'
                        ? 'bg-brand-800 text-white border-brand-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Casal (50/50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setContributor('LUCAS')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      contributor === 'LUCAS'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {partner1Name}
                  </button>
                  <button
                    type="button"
                    onClick={() => setContributor('STEFANI')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      contributor === 'STEFANI'
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {partner2Name}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForDeposit(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-800 hover:bg-brand-900 shadow-xs cursor-pointer"
                >
                  Confirmar Aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
