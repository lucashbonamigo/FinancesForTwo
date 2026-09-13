import React, { useState } from 'react';
import { Transaction, Category, Partner } from '../types/finance';
import { CATEGORIES_LIST } from '../data/mockFinanceData';
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  User,
  Tag,
  CheckCircle,
} from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  partner1Name: string;
  partner2Name: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onAddTransaction,
  partner1Name,
  partner2Name,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [category, setCategory] = useState<Category>('Lazer');
  const [paidBy, setPaidBy] = useState<Partner>('CONJUNTO');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<Category | 'TODAS'>('TODAS');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount.replace(',', '.'));

    if (!title.trim()) {
      alert('Por favor informe a descrição do lançamento.');
      return;
    }
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      alert('Por favor informe um valor válido maior que zero.');
      return;
    }

    onAddTransaction({
      title: title.trim(),
      amount: cleanAmount,
      category,
      type,
      paidBy,
      date: new Date().toLocaleDateString('pt-BR'),
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setNotes('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesCategory =
      selectedFilterCategory === 'TODAS' ? true : t.category === selectedFilterCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Notificação Toast de Sucesso */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-600 transition-all">
          <CheckCircle className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-semibold">Lançamento salvo com sucesso no orçamento!</span>
        </div>
      )}

      {/* Grid: Formulário de Entrada & Histórico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulário de Novo Lançamento (5 colunas) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Novo Lançamento</h2>
            <p className="text-xs text-slate-500 mb-6">
              Registre despesas ou receitas divididas entre o casal
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher: Despesa / Receita */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType('EXPENSE')}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    type === 'EXPENSE'
                      ? 'bg-white text-rose-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  - Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setType('INCOME')}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    type === 'INCOME'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + Receita
                </button>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descrição
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jantar restaurante, IPTU parcela 4..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-800/30 focus:border-brand-800 transition-all"
                  required
                />
              </div>

              {/* Valor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Valor (R$)
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
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-800/30 focus:border-brand-800 transition-all"
                    required
                  />
                </div>
              </div>

              {/* DROPDOWN OBRIGATÓRIO DE CATEGORIAS PRÉ-DEFINIDAS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Categoria Obrigatória
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-brand-800/40 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-800/40 focus:border-brand-800 transition-all cursor-pointer"
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
                <p className="text-[11px] text-slate-400 mt-1">
                  Categorias: IPTU, IPVA, Manutenção, Cursos, Esportes, Lazer, Compras, Presentes.
                </p>
              </div>

              {/* Quem Pagou? (Divisão de Casal) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quem Pagou?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaidBy('CONJUNTO')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                      paidBy === 'CONJUNTO'
                        ? 'bg-brand-800 text-white border-brand-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Casal (50/50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaidBy('LUCAS')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                      paidBy === 'LUCAS'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {partner1Name}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaidBy('STEFANI')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                      paidBy === 'STEFANI'
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {partner2Name}
                  </button>
                </div>
              </div>

              {/* Observações Opcionais */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Observações (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pago no cartão virtual, dividido..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-800/30 focus:border-brand-800 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                + Adicionar ao Orçamento
              </button>
            </form>
          </div>
        </div>

        {/* Histórico & Filtros (7 colunas) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Histórico de Lançamentos</h2>
                <p className="text-xs text-slate-500">
                  {filteredTransactions.length} registro(s) encontrado(s)
                </p>
              </div>

              {/* Barra de Busca */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar lançamento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-800/30"
                />
              </div>
            </div>

            {/* Categorias Filtros Rápidos (Pills) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedFilterCategory('TODAS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilterCategory === 'TODAS'
                    ? 'bg-brand-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas
              </button>
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedFilterCategory === cat
                      ? 'bg-brand-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Lista de Transações */}
            <div className="divide-y divide-slate-100 mt-4">
              {filteredTransactions.length === 0 ? (
                <div className="py-12 text-center">
                  <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500">Nenhum lançamento encontrado</p>
                  <p className="text-xs text-slate-400">Tente ajustar o termo de busca ou o filtro</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => {
                  const isExpense = tx.type === 'EXPENSE';
                  return (
                    <div
                      key={tx.id}
                      className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isExpense
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {isExpense ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{tx.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {tx.category}
                            </span>
                            <span>•</span>
                            <span className="text-[11px]">
                              {tx.paidBy === 'CONJUNTO'
                                ? 'Casal (50/50)'
                                : tx.paidBy === 'LUCAS'
                                ? partner1Name
                                : partner2Name}
                            </span>
                            <span>•</span>
                            <span className="text-[11px]">{tx.date}</span>
                          </div>
                          {tx.notes && (
                            <p className="text-[11px] text-slate-400 italic mt-0.5">{tx.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-extrabold ${
                            isExpense ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          {isExpense ? '-' : '+'} {formatBRL(tx.amount)}
                        </p>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {isExpense ? 'Despesa' : 'Receita'}
                        </span>
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
