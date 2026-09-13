import React, { useState } from 'react';
import { DebtPlan, UpcomingBill, Category, Partner } from '../types/finance';
import { CATEGORIES_LIST } from '../data/mockFinanceData';
import { formatMonthLabel, addMonths, diffInMonths } from '../data/dateUtils';
import {
  CreditCard,
  Calendar,
  PlusCircle,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  Receipt,
  CalendarCheck,
  X,
  Info,
} from 'lucide-react';

interface DebtsProps {
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  debtPlans: DebtPlan[];
  onAddDebtPlan: (debt: Omit<DebtPlan, 'id' | 'installmentAmount'>) => void;
  onPayDebtInstallment: (debtId: string) => void;
  onDeleteDebtPlan: (id: string) => void;
  upcomingBills: UpcomingBill[];
  onToggleBillPaid: (billId: string) => void;
  onAddBill?: (bill: Omit<UpcomingBill, 'id'>) => void;
  onDeleteBill?: (billId: string) => void;
  partner1Name: string;
  partner2Name: string;
}

export const Debts: React.FC<DebtsProps> = ({
  selectedMonth,
  onSelectMonth,
  debtPlans,
  onAddDebtPlan,
  onPayDebtInstallment,
  onDeleteDebtPlan,
  upcomingBills,
  onToggleBillPaid,
  onAddBill,
  onDeleteBill,
  partner1Name,
  partner2Name,
}) => {
  // Modal de Nova Dívida Parcelada
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [debtTitle, setDebtTitle] = useState('');
  const [debtTotalAmount, setDebtTotalAmount] = useState('');
  const [debtTotalInstallments, setDebtTotalInstallments] = useState('36');
  const [debtCategory, setDebtCategory] = useState<Category>('Manutenção (Carro/Moto)');
  const [debtStartMonth, setDebtStartMonth] = useState(selectedMonth);
  const [debtResponsible, setDebtResponsible] = useState<Partner>('CONJUNTO');
  const [debtPaidInitial, setDebtPaidInitial] = useState('0');
  const [debtNotes, setDebtNotes] = useState('');

  // Modal de Nova Conta Recorrente
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [billTitle, setBillTitle] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billCategory, setBillCategory] = useState<Category>('IPTU');
  const [billDueDate, setBillDueDate] = useState('15/10/2026');
  const [billResponsible, setBillResponsible] = useState<Partner>('CONJUNTO');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // 1. Parcelas ativas de dívidas no mês selecionado
  interface ActiveInstallment {
    debt: DebtPlan;
    installmentNumber: number;
    amount: number;
    isPaid: boolean;
  }

  const activeInstallments: ActiveInstallment[] = debtPlans
    .map((debt) => {
      const monthOffset = diffInMonths(debt.startMonth, selectedMonth);
      if (monthOffset >= 0 && monthOffset < debt.totalInstallments) {
        const num = monthOffset + 1;
        const isPaid = num <= debt.paidInstallments;
        return {
          debt,
          installmentNumber: num,
          amount: debt.installmentAmount,
          isPaid,
        };
      }
      return null;
    })
    .filter((item): item is ActiveInstallment => item !== null);

  const totalDebtInstallmentsForMonth = activeInstallments.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  // 2. Contas fixas do mês selecionado
  const billsForMonth = upcomingBills.filter(
    (b) => !b.month || b.month === selectedMonth
  );
  const totalBillsForMonth = billsForMonth.reduce((acc, b) => acc + b.amount, 0);

  // 3. Total de compromissos no mês
  const totalCommitmentsForMonth = totalDebtInstallmentsForMonth + totalBillsForMonth;

  // Próximos 6 meses para a projeção
  const next6Months = [0, 1, 2, 3, 4, 5].map((offset) => addMonths(selectedMonth, offset));

  // Submit Nova Dívida
  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTotal = parseFloat(debtTotalAmount.replace(',', '.'));
    const cleanInstallments = parseInt(debtTotalInstallments, 10);
    const cleanPaidInitial = parseInt(debtPaidInitial, 10) || 0;

    if (!debtTitle.trim() || isNaN(cleanTotal) || cleanTotal <= 0) {
      alert('Por favor, informe uma descrição e valor total válidos.');
      return;
    }
    if (isNaN(cleanInstallments) || cleanInstallments < 1) {
      alert('Informe a quantidade de parcelas (mínimo 1).');
      return;
    }

    onAddDebtPlan({
      title: debtTitle.trim(),
      totalAmount: cleanTotal,
      totalInstallments: cleanInstallments,
      paidInstallments: Math.min(cleanPaidInitial, cleanInstallments),
      startMonth: debtStartMonth,
      category: debtCategory,
      responsible: debtResponsible,
      notes: debtNotes.trim() || undefined,
    });

    setDebtTitle('');
    setDebtTotalAmount('');
    setDebtTotalInstallments('36');
    setDebtPaidInitial('0');
    setDebtNotes('');
    setIsAddDebtOpen(false);
  };

  // Submit Nova Conta Fixa
  const handleBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(billAmount.replace(',', '.'));
    if (!billTitle.trim() || isNaN(cleanAmount) || cleanAmount <= 0) {
      alert('Por favor, informe descrição e valor válidos.');
      return;
    }

    if (onAddBill) {
      onAddBill({
        title: billTitle.trim(),
        category: billCategory,
        amount: cleanAmount,
        dueDate: billDueDate,
        month: selectedMonth,
        daysUntilDue: 10,
        responsible: billResponsible,
        isPaid: false,
      });
    }

    setBillTitle('');
    setBillAmount('');
    setIsAddBillOpen(false);
  };

  // Pré-cálculo da parcela no modal
  const previewTotal = parseFloat(debtTotalAmount.replace(',', '.')) || 0;
  const previewInstallments = parseInt(debtTotalInstallments, 10) || 1;
  const previewPerMonth =
    previewTotal > 0 && previewInstallments > 0 ? previewTotal / previewInstallments : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header: Contas e Dívidas & Navegação de Mês */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
              Gestão de Passivos & Compromissos
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Competência Mensal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Contas e Dívidas de {formatMonthLabel(selectedMonth)}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize contratos parcelados de longo prazo, contas fixas assumidas e o impacto no orçamento do casal.
          </p>
        </div>

        {/* Controles de Navegação Mensal */}
        <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 self-stretch md:self-auto justify-between md:justify-start">
          <button
            onClick={() => onSelectMonth(addMonths(selectedMonth, -1))}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-all cursor-pointer"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="px-3 py-1.5 text-center min-w-[120px]">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
              Mês Selecionado
            </span>
            <span className="text-sm font-extrabold text-slate-900">
              {formatMonthLabel(selectedMonth)}
            </span>
          </div>

          <button
            onClick={() => onSelectMonth(addMonths(selectedMonth, 1))}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-all cursor-pointer"
            title="Próximo Mês"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onSelectMonth('2026-10')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedMonth === '2026-10'
                ? 'bg-brand-800 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Atual
          </button>
        </div>
      </div>

      {/* Hero Cards: Resumo dos Compromissos do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Dívidas Parceladas Ativas */}
        <div className="bg-gradient-to-br from-rose-50 to-red-100/60 rounded-3xl p-6 border border-rose-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Parcelas de Dívidas no Mês
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-600/10 flex items-center justify-center text-rose-700">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-900 mt-2">
            {formatBRL(totalDebtInstallmentsForMonth)}
          </p>
          <p className="text-xs text-rose-700 mt-1">
            {activeInstallments.length} contrato(s) com parcelas ativas neste mês
          </p>
        </div>

        {/* Card 2: Contas Recorrentes / Fixas */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100/60 rounded-3xl p-6 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Contas Recorrentes no Mês
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-700">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-900 mt-2">
            {formatBRL(totalBillsForMonth)}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            IPTU, IPVA, manutenção e contas fixas previstas
          </p>
        </div>

        {/* Card 3: Total Comprometido */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 border border-slate-700 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Compromissos Totais Assumidos
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-black mt-2">
            {formatBRL(totalCommitmentsForMonth)}
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Total de saídas fixas garantidas para {formatMonthLabel(selectedMonth)}
          </p>
        </div>
      </div>

      {/* SEÇÃO 1: REGISTRO DE DÍVIDAS & CONTAS PARCELADAS (Cards de progresso de parcelas mantidos) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <h2 className="text-xl font-bold text-slate-900">
                Registro de Dívidas & Contas Parceladas
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanhe contratos de longo prazo (ex: R$ 22.000 em 36x) com abatimento progressivo das parcelas.
            </p>
          </div>

          <button
            onClick={() => {
              setDebtStartMonth(selectedMonth);
              setIsAddDebtOpen(true);
            }}
            className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Nova Dívida</span>
          </button>
        </div>

        {/* Lista dos Cards de Dívidas Parceladas */}
        {debtPlans.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Nenhuma dívida ou parcelamento cadastrado.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Cadastre parcelamentos de 12x, 24x, 36x para que o sistema distribua as parcelas automaticamente pelos meses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {debtPlans.map((debt) => {
              const progressPct = Math.round((debt.paidInstallments / debt.totalInstallments) * 100);
              const remainingInstallments = Math.max(0, debt.totalInstallments - debt.paidInstallments);
              const remainingAmount = remainingInstallments * debt.installmentAmount;
              const finishMonth = addMonths(debt.startMonth, debt.totalInstallments - 1);

              const monthOffset = diffInMonths(debt.startMonth, selectedMonth);
              const hasInstallmentThisMonth = monthOffset >= 0 && monthOffset < debt.totalInstallments;
              const currentMonthInstallmentNum = monthOffset + 1;
              const isCurrentPaid = currentMonthInstallmentNum <= debt.paidInstallments;

              return (
                <div
                  key={debt.id}
                  className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {debt.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          {debt.totalInstallments}x de {formatBRL(debt.installmentAmount)}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          Resp: {debt.responsible === 'CONJUNTO' ? 'Casal' : debt.responsible}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-900 text-base sm:text-lg mt-1.5">
                        {debt.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Início: {formatMonthLabel(debt.startMonth)} • Término: {formatMonthLabel(finishMonth)}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja excluir a dívida "${debt.title}"?`)) {
                          onDeleteDebtPlan(debt.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Excluir dívida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Barra de Progresso das Parcelas */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-700">
                        Progresso: <strong>{debt.paidInstallments}</strong> de{' '}
                        <strong>{debt.totalInstallments}</strong> parcelas pagas
                      </span>
                      <span className="font-extrabold text-rose-700">{progressPct}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progressPct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Resumo Financeiro da Dívida */}
                  <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
                        Total Contratado
                      </span>
                      <span className="font-extrabold text-slate-800 text-sm">
                        {formatBRL(debt.totalAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase font-bold tracking-wider">
                        Saldo Restante
                      </span>
                      <span className="font-black text-rose-700 text-sm">
                        {formatBRL(remainingAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Alerta da Parcela do Mês Selecionado */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                    {hasInstallmentThisMonth ? (
                      <div className="flex items-center gap-2 text-slate-700">
                        <CalendarCheck className="w-4 h-4 text-rose-600" />
                        <span>
                          Parcela <strong>{currentMonthInstallmentNum}/{debt.totalInstallments}</strong> em{' '}
                          {formatMonthLabel(selectedMonth)}: {formatBRL(debt.installmentAmount)}
                          {isCurrentPaid && (
                            <span className="ml-1 text-emerald-700 font-bold">(Paga ✓)</span>
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        Sem parcela neste mês selecionado
                      </span>
                    )}

                    {remainingInstallments > 0 && (
                      <button
                        onClick={() => onPayDebtInstallment(debt.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-rose-700 shadow-2xs transition-all cursor-pointer"
                      >
                        + Pagar Parcela ({debt.paidInstallments + 1}ª)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEÇÃO 2: CONTAS RECORRENTES & FIXAS DO MÊS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Contas Fixas & Recorrentes de {formatMonthLabel(selectedMonth)}
            </h2>
            <p className="text-xs text-slate-500">
              Contas de IPTU, IPVA, manutenções e planos recorrentes
            </p>
          </div>

          <button
            onClick={() => setIsAddBillOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Nova Conta</span>
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {billsForMonth.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Nenhuma conta fixa cadastrada para este mês.
            </div>
          ) : (
            billsForMonth.map((bill) => (
              <div
                key={bill.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  bill.isPaid
                    ? 'bg-slate-50/70 border-slate-200 opacity-70'
                    : 'bg-white border-slate-200 hover:border-slate-300'
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
                      <span>Resp: {bill.responsible === 'CONJUNTO' ? 'Casal (50/50)' : bill.responsible}</span>
                      <span>•</span>
                      <span>Vencimento: {bill.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p
                      className={`text-sm font-black ${
                        bill.isPaid ? 'text-slate-400' : 'text-rose-600'
                      }`}
                    >
                      {formatBRL(bill.amount)}
                    </p>
                    <span
                      className={`text-[10px] font-bold ${
                        bill.isPaid ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {bill.isPaid ? 'Pago ✓' : 'A pagar'}
                    </span>
                  </div>

                  {onDeleteBill && (
                    <button
                      onClick={() => onDeleteBill(bill.id)}
                      className="p-1 text-slate-300 hover:text-rose-600"
                      title="Excluir conta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SEÇÃO 3: PROJEÇÃO MENSAL DOS PRÓXIMOS 6 MESES (Mantida fielmente) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Projeção Mensal dos Próximos 6 Meses
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize as parcelas de dívidas ativas assumidas e o comprometimento mensal futuro.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {next6Months.map((mKey) => {
            const debtForM = debtPlans
              .filter((d) => {
                const off = diffInMonths(d.startMonth, mKey);
                return off >= 0 && off < d.totalInstallments;
              })
              .reduce((acc, d) => acc + d.installmentAmount, 0);

            const isCurrentM = mKey === selectedMonth;

            return (
              <button
                key={mKey}
                onClick={() => onSelectMonth(mKey)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isCurrentM
                    ? 'bg-brand-900 text-white border-brand-900 shadow-md ring-2 ring-brand-800/30'
                    : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200/90'
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider block ${
                    isCurrentM ? 'text-emerald-300' : 'text-slate-500'
                  }`}
                >
                  {formatMonthLabel(mKey).split('/')[0]}
                </span>
                <span className="text-xs font-black block mt-0.5">
                  {formatMonthLabel(mKey).split('/')[1]}
                </span>

                <div className="mt-3 pt-2 border-t border-slate-200/40 text-[11px] space-y-1">
                  <span className={isCurrentM ? 'text-white/70' : 'text-slate-500'}>
                    Parcelas ativas:
                  </span>
                  <p className="font-extrabold text-rose-500 text-xs">
                    {debtForM > 0 ? `-${formatBRL(debtForM)}` : 'R$ 0,00'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL: REGISTRAR NOVA DÍVIDA (ex: 22.000 em 36x) */}
      {isAddDebtOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Registrar Dívida / Conta Parcelada</h3>
                <p className="text-xs text-slate-500">
                  Ex: Financiamento de R$ 22.000,00 pago em 36 parcelas mensais
                </p>
              </div>
              <button
                onClick={() => setIsAddDebtOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDebtSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descrição da Dívida *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Financiamento Veículo, Móveis Apartamento..."
                  value={debtTitle}
                  onChange={(e) => setDebtTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-600/30"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Valor Total da Dívida (R$) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Ex: 22000,00"
                      value={debtTotalAmount}
                      onChange={(e) => setDebtTotalAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-600/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Em Quantas Parcelas? *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="360"
                    placeholder="Ex: 36"
                    value={debtTotalInstallments}
                    onChange={(e) => setDebtTotalInstallments(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600/30"
                    required
                  />
                </div>
              </div>

              {/* Box de Cálculo Automático da Parcela */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-800">
                  <Info className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold">Valor da Parcela Mensal Calculada:</span>
                </div>
                <span className="text-base font-black text-rose-900">
                  {formatBRL(previewPerMonth)} / mês
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mês da 1ª Parcela
                  </label>
                  <select
                    value={debtStartMonth}
                    onChange={(e) => setDebtStartMonth(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                  >
                    {[-2, -1, 0, 1, 2, 3, 4, 5].map((offset) => {
                      const m = addMonths(selectedMonth, offset);
                      return (
                        <option key={m} value={m}>
                          {formatMonthLabel(m)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Parcelas Já Pagas Inicialmente
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={debtTotalInstallments}
                    value={debtPaidInitial}
                    onChange={(e) => setDebtPaidInitial(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Categoria Obrigatória
                </label>
                <select
                  value={debtCategory}
                  onChange={(e) => setDebtCategory(e.target.value as Category)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Responsável pelo Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDebtResponsible('CONJUNTO')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      debtResponsible === 'CONJUNTO'
                        ? 'bg-brand-800 text-white border-brand-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Casal (50/50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDebtResponsible('LUCAS')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      debtResponsible === 'LUCAS'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {partner1Name}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDebtResponsible('STEFANI')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      debtResponsible === 'STEFANI'
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {partner2Name}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Observações (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Contrato em 36 vezes fixas, debitado em conta conjunta..."
                  value={debtNotes}
                  onChange={(e) => setDebtNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDebtOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 shadow-xs cursor-pointer"
                >
                  Salvar Dívida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVA CONTA FIXA / RECORRENTE */}
      {isAddBillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Nova Conta Fixa / Recorrente</h3>
              <button
                onClick={() => setIsAddBillOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBillSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  placeholder="Ex: IPTU Parcela 4, Seguro do Carro..."
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0,00"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Vencimento
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={billDueDate}
                    onChange={(e) => setBillDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Categoria
                </label>
                <select
                  value={billCategory}
                  onChange={(e) => setBillCategory(e.target.value as Category)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
                >
                  {CATEGORIES_LIST.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Responsável
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillResponsible('CONJUNTO')}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      billResponsible === 'CONJUNTO'
                        ? 'bg-brand-800 text-white'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Casal (50/50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillResponsible('LUCAS')}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      billResponsible === 'LUCAS'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {partner1Name}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillResponsible('STEFANI')}
                    className={`py-2 text-xs font-bold rounded-xl border ${
                      billResponsible === 'STEFANI'
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {partner2Name}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBillOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black shadow-xs cursor-pointer"
                >
                  Adicionar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
