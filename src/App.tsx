import React, { useState } from 'react';
import {
  initialCoupleData,
  initialIncomes,
  initialGoals,
  initialDebtPlans,
  initialUpcomingBills,
  financialTimelineData,
} from './data/mockFinanceData';
import {
  CoupleData,
  IncomeItem,
  Goal,
  DebtPlan,
  UpcomingBill,
  Partner,
  FinancialTimelineMonth,
} from './types/finance';
import { Navbar, ActiveTabType } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Incomes } from './components/Incomes';
import { Goals } from './components/Goals';
import { Debts } from './components/Debts';
import { Heart } from 'lucide-react';

export function App() {
  // Controle de Navegação das 4 Abas Solicitadas
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');

  // Competência Mensal Selecionada (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');

  // Estado Central do Orçamento e Saldos do Casal
  const [couple, setCouple] = useState<CoupleData>(initialCoupleData);

  // Estado Central de Entradas (Aba 2)
  const [incomes, setIncomes] = useState<IncomeItem[]>(initialIncomes);

  // Estado Central de Metas do Casal (Aba 3)
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  // Estado Central de Contas e Dívidas (Aba 4)
  const [debtPlans, setDebtPlans] = useState<DebtPlan[]>(initialDebtPlans);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>(initialUpcomingBills);

  // Dados para os Gráficos de Linha do Tempo (Passado + Projeções Futuras)
  const [timelineData] = useState<FinancialTimelineMonth[]>(financialTimelineData);

  // ==========================================
  // HANDLERS: ABA 2 - ENTRADAS
  // ==========================================
  const handleAddIncome = (incomeData: Omit<IncomeItem, 'id'>) => {
    const newIncome: IncomeItem = {
      ...incomeData,
      id: `inc_${Date.now()}`,
    };

    setIncomes((prev) => [newIncome, ...prev]);

    // Se já foi recebida, atualiza os saldos de imediato
    if (newIncome.isReceived) {
      updateBalancesOnIncome(newIncome.amount, newIncome.recipient, true);
    }
  };

  const handleDeleteIncome = (id: string) => {
    const target = incomes.find((i) => i.id === id);
    if (target && target.isReceived) {
      // Reverte o saldo se estava recebido
      updateBalancesOnIncome(target.amount, target.recipient, false);
    }
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggleIncomeReceived = (id: string) => {
    setIncomes((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        const willReceive = !inc.isReceived;
        // Atualiza saldos dependendo da transição
        updateBalancesOnIncome(inc.amount, inc.recipient, willReceive);
        return { ...inc, isReceived: willReceive };
      })
    );
  };

  const updateBalancesOnIncome = (amount: number, recipient: Partner, isAdding: boolean) => {
    const factor = isAdding ? 1 : -1;
    let lucasDelta = 0;
    let stefaniDelta = 0;

    if (recipient === 'LUCAS') {
      lucasDelta = amount * factor;
    } else if (recipient === 'STEFANI') {
      stefaniDelta = amount * factor;
    } else {
      lucasDelta = (amount / 2) * factor;
      stefaniDelta = (amount / 2) * factor;
    }

    setCouple((prev) => ({
      ...prev,
      partner1: {
        ...prev.partner1,
        currentBalance: prev.partner1.currentBalance + lucasDelta,
      },
      partner2: {
        ...prev.partner2,
        currentBalance: prev.partner2.currentBalance + stefaniDelta,
      },
      jointBalance: prev.jointBalance + amount * factor,
    }));
  };

  // ==========================================
  // HANDLERS: ABA 3 - METAS DO CASAL
  // ==========================================
  const handleAddGoal = (
    goalData: Omit<Goal, 'id' | 'contributions'> & {
      initialContribution?: number;
      contributor?: Partner;
    }
  ) => {
    const { initialContribution, contributor = 'CONJUNTO', ...rest } = goalData;
    const initialContributionsList =
      initialContribution && initialContribution > 0
        ? [
            {
              id: `contrib_${Date.now()}`,
              contributor,
              amount: initialContribution,
              date: new Date().toLocaleDateString('pt-BR'),
            },
          ]
        : [];

    const newGoal: Goal = {
      ...rest,
      id: `goal_${Date.now()}`,
      contributions: initialContributionsList,
    };

    setGoals((prev) => [newGoal, ...prev]);

    // Se houve aporte inicial, desconta do saldo
    if (initialContribution && initialContribution > 0) {
      deductGoalContributionFromBalance(initialContribution, contributor);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleAddContribution = (goalId: string, amount: number, contributor: Partner) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          currentAmount: g.currentAmount + amount,
          contributions: [
            {
              id: `contrib_${Date.now()}`,
              contributor,
              amount,
              date: new Date().toLocaleDateString('pt-BR'),
            },
            ...g.contributions,
          ],
        };
      })
    );

    deductGoalContributionFromBalance(amount, contributor);
  };

  const deductGoalContributionFromBalance = (amount: number, contributor: Partner) => {
    const lucasDebit = contributor === 'LUCAS' ? -amount : contributor === 'CONJUNTO' ? -(amount / 2) : 0;
    const stefaniDebit = contributor === 'STEFANI' ? -amount : contributor === 'CONJUNTO' ? -(amount / 2) : 0;

    setCouple((prev) => ({
      ...prev,
      partner1: {
        ...prev.partner1,
        currentBalance: prev.partner1.currentBalance + lucasDebit,
      },
      partner2: {
        ...prev.partner2,
        currentBalance: prev.partner2.currentBalance + stefaniDebit,
      },
      jointBalance: prev.jointBalance - amount,
    }));
  };

  // ==========================================
  // HANDLERS: ABA 4 - CONTAS E DÍVIDAS
  // ==========================================
  const handleAddDebtPlan = (debtData: Omit<DebtPlan, 'id' | 'installmentAmount'>) => {
    const installmentAmount =
      debtData.totalInstallments > 0
        ? Math.round((debtData.totalAmount / debtData.totalInstallments) * 100) / 100
        : debtData.totalAmount;

    const newDebt: DebtPlan = {
      ...debtData,
      id: `debt_${Date.now()}`,
      installmentAmount,
    };
    setDebtPlans((prev) => [newDebt, ...prev]);
  };

  const handlePayDebtInstallment = (debtId: string) => {
    const debt = debtPlans.find((d) => d.id === debtId);
    if (!debt || debt.paidInstallments >= debt.totalInstallments) return;

    // Desconta o valor da parcela dos saldos do casal
    const installment = debt.installmentAmount;
    let lucasDebit = 0;
    let stefaniDebit = 0;

    if (debt.responsible === 'LUCAS') {
      lucasDebit = -installment;
    } else if (debt.responsible === 'STEFANI') {
      stefaniDebit = -installment;
    } else {
      lucasDebit = -(installment / 2);
      stefaniDebit = -(installment / 2);
    }

    setCouple((prev) => ({
      ...prev,
      partner1: {
        ...prev.partner1,
        currentBalance: prev.partner1.currentBalance + lucasDebit,
      },
      partner2: {
        ...prev.partner2,
        currentBalance: prev.partner2.currentBalance + stefaniDebit,
      },
      jointBalance: prev.jointBalance - installment,
    }));

    setDebtPlans((prev) =>
      prev.map((d) =>
        d.id === debtId ? { ...d, paidInstallments: d.paidInstallments + 1 } : d
      )
    );
  };

  const handleDeleteDebtPlan = (debtId: string) => {
    setDebtPlans((prev) => prev.filter((d) => d.id !== debtId));
  };

  const handleToggleBillPaid = (billId: string) => {
    setUpcomingBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, isPaid: !b.isPaid } : b))
    );
  };

  const handleAddBill = (billData: Omit<UpcomingBill, 'id'>) => {
    const newBill: UpcomingBill = {
      ...billData,
      id: `bill_${Date.now()}`,
    };
    setUpcomingBills((prev) => [newBill, ...prev]);
  };

  const handleDeleteBill = (billId: string) => {
    setUpcomingBills((prev) => prev.filter((b) => b.id !== billId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Barra de Navegação Superior Fixa */}
      <Navbar
        couple={couple}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        onOpenNewIncome={() => {
          setActiveTab('incomes');
        }}
      />

      {/* Conteúdo Principal com Layout Responsivo (Grid / Flexbox) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* ABA 1: VISÃO GERAL */}
        {activeTab === 'dashboard' && (
          <Dashboard
            couple={couple}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            timelineData={timelineData}
            goals={goals}
            upcomingBills={upcomingBills}
            debtPlans={debtPlans}
            incomes={incomes}
            onToggleBillPaid={handleToggleBillPaid}
            onPayDebtInstallment={handlePayDebtInstallment}
            onNavigateTab={(tab) => setActiveTab(tab)}
            partner1Name={couple.partner1.name}
            partner2Name={couple.partner2.name}
          />
        )}

        {/* ABA 2: ENTRADAS */}
        {activeTab === 'incomes' && (
          <Incomes
            incomes={incomes}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
            onToggleReceived={handleToggleIncomeReceived}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            partner1Name={couple.partner1.name}
            partner2Name={couple.partner2.name}
          />
        )}

        {/* ABA 3: METAS DO CASAL */}
        {activeTab === 'goals' && (
          <Goals
            goals={goals}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
            onAddContribution={handleAddContribution}
            partner1Name={couple.partner1.name}
            partner2Name={couple.partner2.name}
          />
        )}

        {/* ABA 4: CONTAS E DÍVIDAS */}
        {activeTab === 'debts' && (
          <Debts
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            debtPlans={debtPlans}
            onAddDebtPlan={handleAddDebtPlan}
            onPayDebtInstallment={handlePayDebtInstallment}
            onDeleteDebtPlan={handleDeleteDebtPlan}
            upcomingBills={upcomingBills}
            onToggleBillPaid={handleToggleBillPaid}
            onAddBill={handleAddBill}
            onDeleteBill={handleDeleteBill}
            partner1Name={couple.partner1.name}
            partner2Name={couple.partner2.name}
          />
        )}
      </main>

      {/* Rodapé Elegante e Informativo */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <Heart className="w-3 h-3 fill-pink-500" />
            </div>
            <span className="font-semibold text-slate-700">
              Finanças a Dois • Controle Financeiro de {couple.partner1.name} & {couple.partner2.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Visão Geral</span>
            <span>•</span>
            <span>Entradas</span>
            <span>•</span>
            <span>Metas</span>
            <span>•</span>
            <span>Contas e Dívidas</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
