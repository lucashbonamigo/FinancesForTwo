import React from 'react';
import { Debts } from './Debts';
import { DebtPlan, UpcomingBill } from '../types/finance';

interface ForecastsViewProps {
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  debtPlans: DebtPlan[];
  onAddDebtPlan: (debt: Omit<DebtPlan, 'id' | 'installmentAmount'>) => void;
  onPayDebtInstallment: (debtId: string) => void;
  onDeleteDebtPlan: (id: string) => void;
  upcomingBills: UpcomingBill[];
  partner1Name: string;
  partner2Name: string;
  onToggleBillPaid?: (billId: string) => void;
}

export const ForecastsView: React.FC<ForecastsViewProps> = ({
  selectedMonth,
  onSelectMonth,
  debtPlans,
  onAddDebtPlan,
  onPayDebtInstallment,
  onDeleteDebtPlan,
  upcomingBills,
  partner1Name,
  partner2Name,
  onToggleBillPaid = () => {},
}) => {
  return (
    <Debts
      selectedMonth={selectedMonth}
      onSelectMonth={onSelectMonth}
      debtPlans={debtPlans}
      onAddDebtPlan={onAddDebtPlan}
      onPayDebtInstallment={onPayDebtInstallment}
      onDeleteDebtPlan={onDeleteDebtPlan}
      upcomingBills={upcomingBills}
      onToggleBillPaid={onToggleBillPaid}
      partner1Name={partner1Name}
      partner2Name={partner2Name}
    />
  );
};

export default ForecastsView;
