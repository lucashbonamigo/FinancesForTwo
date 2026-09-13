import React, { useState } from 'react';
import { IncomeItem, Partner, Category } from '../types/finance';
import { CATEGORIES_LIST } from '../data/mockFinanceData';
import { formatMonthLabel } from '../data/dateUtils';
import {
  TrendingUp,
  Search,
  PlusCircle,
  Calendar,
  DollarSign,
  User,
  Trash2,
  CheckCircle,
  ArrowUpRight,
  Filter,
  FileText,
  Tag,
} from 'lucide-react';

interface IncomesProps {
  incomes: IncomeItem[];
  onAddIncome: (income: Omit<IncomeItem, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  onToggleReceived?: (id: string) => void;
  selectedMonth: string;
  onSelectMonth?: (month: string) => void;
  partner1Name: string;
  partner2Name: string;
}

export const Incomes: React.FC<IncomesProps> = ({
  incomes,
  onAddIncome,
  onDeleteIncome,
  onToggleReceived,
  selectedMonth,
  onSelectMonth,
  partner1Name,
  partner2Name,
}) => {
  // Form States
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isReceived, setIsReceived] = useState(true);
  const [date, setDate] = useState(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });
  const [recipient, setRecipient] = useState<Partner>('LUCAS');
  const [category, setCategory] = useState<Category>('Cursos');
  const [notes, setNotes] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRecipient, setFilterRecipient] = useState<'ALL' | Partner>('ALL');
  const [filterPeriod, setFilterPeriod] = useState<'SELECTED_MONTH' | 'ALL'>('SELECTED_MONTH');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount.replace(',', '.'));

    if (!description.trim()) {
      alert('Por favor informe a descrição da entrada.');
      return;
    }
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      alert('Por favor informe um valor válido maior que zero.');
      return;
    }

    // Calcula mês correspondente a partir da data (DD/MM/YYYY)
    let entryMonth = selectedMonth;
    if (date && date.includes('/')) {
      const parts = date.split('/');
      if (parts.length === 3 && parts[2].length === 4) {
        entryMonth = `${parts[2]}-${parts[1].padStart(2, '0')}`;
      }
    }

    onAddIncome({
      description: description.trim(),
      amount: cleanAmount,
      date: date.trim(),
      month: entryMonth,
      recipient,
      category,
      notes: notes.trim() || undefined,
      isReceived,
    });

    setDescription('');
    setAmount('');
    setNotes('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  // Cálculos do Mês Selecionado
  const monthIncomes = incomes.filter((i) => i.month === selectedMonth);
  const totalMonthIncomes = monthIncomes.reduce((acc, i) => acc + i.amount, 0);
  const partner1Total = monthIncomes
    .filter((i) => i.recipient === 'LUCAS')
    .reduce((acc, i) => acc + i.amount, 0);
  const partner2Total = monthIncomes
    .filter((i) => i.recipient === 'STEFANI')
    .reduce((acc, i) => acc + i.amount, 0);
  const jointTotal = monthIncomes
    .filter((i) => i.recipient === 'CONJUNTO')
    .reduce((acc, i) => acc + i.amount, 0);

  // Filtragem da Lista
  const displayedIncomes = incomes.filter((item) => {
    const matchesPeriod =
      filterPeriod === 'ALL' ? true : item.month === selectedMonth;
    const matchesRecipient =
      filterRecipient === 'ALL' ? true : item.recipient === filterRecipient;
    const matchesSearch =
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPeriod && matchesRecipient && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast de Confirmação */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-600 transition-all animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-semibold">Entrada registrada com sucesso!</span>
        </div>
      )}

      {/* Header Resumo das Entradas do Mês */}
      <div className="bg-gradient-to-br from-teal-900 via-brand-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
                Gestão Exclusiva de Receitas
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/15 text-emerald-100 font-semibold">
                {formatMonthLabel(selectedMonth)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1 text-white">
              Entradas & Ganhos do Casal
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
              Registre salários, consultorias, bônus, rendimentos e receitas individuais ou conjuntas.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 text-left sm:text-right">
            <span className="text-xs font-semibold text-emerald-200 block">
              Total de Entradas no Mês
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white">
              +{formatBRL(totalMonthIncomes)}
            </p>
          </div>
        </div>

        {/* Breakdown por Pessoa no Mês */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/15 text-xs">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[10px]">
                {partner1Name[0]}
              </div>
              <span className="text-emerald-100 font-medium">{partner1Name}:</span>
            </div>
            <span className="font-extrabold text-white text-sm">+{formatBRL(partner1Total)}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-bold flex items-center justify-center text-[10px]">
                {partner2Name[0]}
              </div>
              <span className="text-emerald-100 font-medium">{partner2Name}:</span>
            </div>
            <span className="font-extrabold text-white text-sm">+{formatBRL(partner2Total)}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">
                C
              </div>
              <span className="text-emerald-100 font-medium">Conjunto / Casal:</span>
            </div>
            <span className="font-extrabold text-white text-sm">+{formatBRL(jointTotal)}</span>
          </div>
        </div>
      </div>

      {/* Grid: Formulário de Registro Manual & Histórico de Entradas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulário de Registro Manual de Entradas (5 colunas) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs sticky top-24 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-xl font-bold text-slate-900">Registrar Nova Entrada</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Adicione receitas recebidas por {partner1Name}, {partner2Name} ou pelo Casal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Descrição */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descrição da Entrada *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: Salário Lucas, Bônus Stefani, Freelance..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Valor e Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Valor (R$) *
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
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Data do Recebimento *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* De quem é a entrada? (Lucas, Stefani ou Conjunto) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  De quem é esta entrada? *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipient('LUCAS')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${
                      recipient === 'LUCAS'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{partner1Name}</span>
                    <span className="text-[10px] font-normal opacity-80">Pessoa A</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipient('STEFANI')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${
                      recipient === 'STEFANI'
                        ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{partner2Name}</span>
                    <span className="text-[10px] font-normal opacity-80">Pessoa B</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipient('CONJUNTO')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${
                      recipient === 'CONJUNTO'
                        ? 'bg-brand-800 text-white border-brand-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Conjunto</span>
                    <span className="text-[10px] font-normal opacity-80">Casal (50/50)</span>
                  </button>
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Categoria
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all cursor-pointer"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Observações (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Depositado na conta corrente, comprovante arquivado..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Registrar Entrada</span>
              </button>
            </form>
          </div>
        </div>

        {/* Histórico das Entradas (7 colunas) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* Top Bar de Busca e Filtros */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Histórico de Entradas</h2>
                <p className="text-xs text-slate-500">
                  {displayedIncomes.length} receita(s) encontrada(s)
                </p>
              </div>

              {/* Busca */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar entrada..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>
            </div>

            {/* Controles de Filtros Rápidos */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {/* Filtro por Beneficiário */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterRecipient('ALL')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterRecipient === 'ALL'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterRecipient('LUCAS')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterRecipient === 'LUCAS'
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {partner1Name}
                </button>
                <button
                  onClick={() => setFilterRecipient('STEFANI')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterRecipient === 'STEFANI'
                      ? 'bg-pink-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {partner2Name}
                </button>
                <button
                  onClick={() => setFilterRecipient('CONJUNTO')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filterRecipient === 'CONJUNTO'
                      ? 'bg-brand-800 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Casal
                </button>
              </div>

              {/* Alternador de Período: Apenas Mês Atual vs Todas */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setFilterPeriod('SELECTED_MONTH')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    filterPeriod === 'SELECTED_MONTH'
                      ? 'bg-emerald-100 text-emerald-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mês Atual
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setFilterPeriod('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    filterPeriod === 'ALL'
                      ? 'bg-emerald-100 text-emerald-900 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todas as Entradas
                </button>
              </div>
            </div>

            {/* Lista de Registros */}
            <div className="divide-y divide-slate-100 mt-2">
              {displayedIncomes.length === 0 ? (
                <div className="py-12 text-center">
                  <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">Nenhuma entrada encontrada</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Utilize o formulário ao lado para registrar as receitas do casal.
                  </p>
                </div>
              ) : (
                displayedIncomes.map((inc) => {
                  const isLucas = inc.recipient === 'LUCAS';
                  const isStefani = inc.recipient === 'STEFANI';

                  return (
                    <div
                      key={inc.id}
                      className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar do Responsável */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                            isLucas
                              ? 'bg-blue-100 text-blue-700'
                              : isStefani
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isLucas ? 'L' : isStefani ? 'S' : 'C'}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">{inc.description}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            {inc.category && (
                              <>
                                <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                                  {inc.category}
                                </span>
                                <span>•</span>
                              </>
                            )}
                            <span
                              className={`text-[11px] font-bold ${
                                isLucas
                                  ? 'text-blue-700'
                                  : isStefani
                                  ? 'text-pink-700'
                                  : 'text-emerald-800'
                              }`}
                            >
                              {isLucas
                                ? partner1Name
                                : isStefani
                                ? partner2Name
                                : 'Casal (50/50)'}
                            </span>
                            <span>•</span>
                            <span className="text-[11px] text-slate-400">{inc.date}</span>
                          </div>
                          {inc.notes && (
                            <p className="text-[11px] text-slate-400 italic mt-0.5">{inc.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm sm:text-base font-black text-emerald-700">
                            +{formatBRL(inc.amount)}
                          </p>
                          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                            Entrada
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteIncome(inc.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-all"
                          title="Excluir entrada"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
