import React from 'react';
import { Goals } from './Goals';
import { Goal, Partner } from '../types/finance';

interface GoalsViewProps {
  goals: Goal[];
  onAddContribution: (goalId: string, amount: number, contributor: Partner) => void;
  onAddGoal?: (goal: Omit<Goal, 'id' | 'contributions'> & { initialContribution?: number; contributor?: Partner }) => void;
  onDeleteGoal?: (goalId: string) => void;
  partner1Name: string;
  partner2Name: string;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddContribution,
  onAddGoal = () => {},
  onDeleteGoal = () => {},
  partner1Name,
  partner2Name,
}) => {
  return (
    <Goals
      goals={goals}
      onAddContribution={onAddContribution}
      onAddGoal={onAddGoal}
      onDeleteGoal={onDeleteGoal}
      partner1Name={partner1Name}
      partner2Name={partner2Name}
    />
  );
};

export default GoalsView;
