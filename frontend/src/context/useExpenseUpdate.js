import { useContext } from 'react';
import { ExpenseUpdateContext } from './ExpenseUpdateContextContext.js';

export function useExpenseUpdate() {
  return useContext(ExpenseUpdateContext);
}
